import { IBaseEntity } from './';

export interface ILoginUser {
  email: string,
  password: string
}

export interface IRegisterUser extends ILoginUser {
  displayName: string,
}

export interface IUser {
  _id: string,
  email: string,
  displayName: string
}

export interface ICurrentUser extends IUser {
  token: string;
}