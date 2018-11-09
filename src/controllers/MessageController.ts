import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';

export default class MessageController {
  constructor() {
    this.getMyMessages = this.getMyMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  public sendMessage(req: Request, res: Response) {
    const currentUser = req.body.user._id;
    const newMessage = new Message({
      text: req.body.text,
      recipient_id: req.body.recipient_id,
      createdBy: currentUser
    });

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
      Message.find({ 'createdBy': currentUser}),
      Message.find({ 'recipient_id': currentUser})
    ])
      .then(result => ({ sent: result[0], received: result[1] }))
      .catch(error => error)
  }

}
