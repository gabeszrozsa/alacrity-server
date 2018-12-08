import { IBaseEntity, ILocationView } from './';

interface IEventBase {
  name: string,
  date: Date,
  createdBy: string
}

export interface IEventCreate extends IEventBase {
  location_id: string
}

export interface IEventView extends IBaseEntity, IEventBase {
  location: ILocationView,
  attendees: string[]
}