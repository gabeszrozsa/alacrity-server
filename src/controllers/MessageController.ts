import { Request, Response } from 'express';
import { IMessageView, IMessageCreate } from 'entities/message';
import { MessageRepository } from '../repositories';

export default class MessageController {
  public sendMessage(req: Request, res: Response) {
    const currentUser = req.body.user._id;
    const messageCreate: IMessageCreate = {
      text: req.body.text,
      recipient_id: req.body.recipient_id,
      createdBy: currentUser
    };

    MessageRepository.sendMessage(messageCreate, currentUser)
      .then((messages: IMessageView[]) => res.json(messages))
      .catch(error => res.status(400).send(error));
  }

  public getMyMessages(req: Request, res: Response) {
    const currentUser = req.body.user._id;
    MessageRepository.fetchMyMessages(currentUser)
      .then((messages: IMessageView[]) => res.json(messages))
      .catch(error => res.status(400).send(error))
  }

  public deleteMessage(req: Request, res: Response) {
    const id = req.params.id;
    const currentUser = req.body.user._id;

    MessageRepository.deleteMessage(id, currentUser)
      .then((messages: IMessageView[]) => res.json(messages))
      .catch(error => res.status(400).send(error))
  }
}
