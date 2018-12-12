import { IMessageCreate, IMessageView } from "../entities/";
import { Message, User } from "../models";

export default class MessageRepository {

  public static fetchMyMessages(currentUser) {
    return Promise.all([
      Message
        .find({ 'createdBy': currentUser})
        .populate('recipient_id', 'displayName', User),
      Message
        .find({ 'recipient_id': currentUser})
        .populate('createdBy', 'displayName', User)
    ])
      .then(result => ({ sent: result[0], received: result[1]}))
      .catch(error => error)
  }
  
  public static sendMessage(message: IMessageCreate, currentUser: string) {
    return new Promise((resolve, reject) => {
      const newMessage = new Message(message);

      newMessage.save()
        .then(result => {
          this.fetchMyMessages(currentUser)
            .then((messages: IMessageView[]) => resolve(messages))
            .catch(error => {
              console.log('[ERROR] - MessageRepository :: fetchMyMessages (sendMessage)');
              console.log('message | ', message);
              console.log('currentUser | ', currentUser);
              console.log(error);
              reject(error)
            })
        })
        .catch(error => {
          console.log('[ERROR] - MessageRepository :: sendMessage');
          console.log('message | ', message);
          console.log('currentUser | ', currentUser);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteMessage(id: string, currentUser: string) {
    if (!Message.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {

      Message.deleteOne({ _id: id })
      .then(() => {
        this.fetchMyMessages(currentUser)
          .then((messages: IMessageView[]) => resolve(messages))
          .catch(error => {
            console.log('[ERROR] - MessageRepository :: fetchMyMessages (deleteMessage)');
            console.log('id | ', id);
            console.log('currentUser | ', currentUser);
            console.log(error);
            reject(error)
          })
      })
      .catch(error => {
        console.log('[ERROR] - MessageRepository :: deleteMessage | id: ', id);
        console.log(error);
        reject(error)
      });

    });
  }

}