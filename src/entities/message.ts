import { IBaseEntity, IUser } from './';

export interface IMessageCreate {
  text: string,
  recipient_id: string,
  createdBy: string
}

export interface IMessageView extends IBaseEntity {
  partner: IUser,
  text: string,
  recipient_id: IUser
}