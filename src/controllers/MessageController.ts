import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import { IUser } from '../entities/';
import { IMessageView, IMessageCreate } from 'entities/message';

export default class MessageController {
  constructor() {
    this.getMyMessages = this.getMyMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.fetchMyMessages = this.fetchMyMessages.bind(this);
    this.getMessagesWithUsers = this.getMessagesWithUsers.bind(this);
  }

  public sendMessage(req: Request, res: Response) {
    const currentUser = req.body.user._id;
    const messageCreate: IMessageCreate = {
      text: req.body.text,
      recipient_id: req.body.recipient_id,
      createdBy: currentUser
    };
    const newMessage = new Message(messageCreate);

    newMessage.save()
      .then(result => {
        this.fetchMyMessages(currentUser)
          .then(result => res.json(result))
          .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error));
  }

  public getMyMessages(req: Request, res: Response) {
    const currentUser = req.body.user._id;
    this.fetchMyMessages(currentUser)
      .then(result => res.json(result))
      .catch(error => res.status(400).send(error))
  }

  public deleteMessage(req: Request, res: Response) {
    const id = req.params.id;
    const currentUser = req.body.user._id;

    if (!Message.validateID(id)) {
        return res.status(404).send();
    }

    Message.deleteOne({ _id: id }, (err, result) => {
      if(err){
        res.send(err);
      }
      this.fetchMyMessages(currentUser)
        .then(result => res.json(result))
        .catch(error => res.status(400).send(error))
    });
  }

  public fetchMyMessages(currentUser) {
    return Promise.all([
      Message.find({ 'createdBy': currentUser})
        .then(async res => {
          const messagesWithUsers = await this.getMessagesWithUsers(res, 'recipient_id');
          return messagesWithUsers;
        }),
        Message.find({ 'recipient_id': currentUser})
        .then(async res => {
          const messagesWithUsers = await this.getMessagesWithUsers(res, 'createdBy');
          return messagesWithUsers;
        })
    ])
      .then(result => ({ sent: result[0], received: result[1]}))
      .catch(error => error)
  }

  private async getMessagesWithUsers(messagesData, targetUser) {
    const messages = [];
    for (let msg of messagesData) {
      try {
        const partner: IUser = await this.getUser(msg[targetUser]);
        const result: IMessageView = {
          _id: msg._id,
          text: msg.text,
          createdAt: msg.createdAt,
          createdBy: msg.createdBy,
          recipient_id: msg.recipient_id,
          partner: partner
        };

        messages.push(result);
      } catch (error) {
        console.log('[ERROR] - MessageController :: getMessagesWithUsers', error);
      }
    }
    return messages;
  }

  private getUser(user_id: string) {
    return new Promise<IUser>((resolve, reject) => {
      User.findById(user_id).then(result => {
        if (!result){
            reject(`No User with ID: ${user_id}`);
        }
        resolve({ _id: result._id, email: result.email, displayName: result.displayName });
      });
    });
  }

}
