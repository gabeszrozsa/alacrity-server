import { IBaseEntity, IUser, ILocationView, IActivityTypeView } from './';

interface IActivityBase {
  date: Date,
  durationInSeconds: number,
  distanceInMeters: number,
}

export interface IActivityCreate extends IActivityBase {
  location_id: string,
  activityType_id: string,
  createdBy: string
}

export interface IActivityView extends IBaseEntity, IActivityBase {
  location: ILocationView,
  activityType: IActivityTypeView,
  comments: IComment[],
  likes: string[]
}

export interface IComment {
  _id: string,
  text: string,
  createdAt: Date,
  createdBy: IUser
}

export interface ILike {
  _id: string,
  createdAt: Date,
  createdBy: IUser
}