import { IBaseEntity, IUser } from './';

export interface IMessageCreate {
  text: string,
  recipient_id: string,
  createdBy: string
}

export interface IMessageView extends IMessageCreate, IBaseEntity {
  partner: IUser
}