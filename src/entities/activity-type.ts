import { IBaseEntity } from './';

export interface IActivityTypeCreate {
  name: string,
  createdBy: string
}

export interface IActivityTypeView extends IBaseEntity, IActivityTypeCreate {}