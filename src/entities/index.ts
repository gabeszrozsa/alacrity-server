interface IBaseEntity {
  _id: string,
  createdBy: string,
  createdAt: Date
}

export interface ILike extends IBaseEntity {
  _id: string,
  createdAt: Date,
  createdBy: IUser
}

export interface IUser {
  _id: string,
  email: string
}

export interface IActivityType extends IBaseEntity {
  name: string,
}

export interface IComment {
  _id: string,
  text: string,
  createdAt: Date,
  createdBy: IUser
}

export interface ILocation extends IBaseEntity {
  name: string,
  coordinates: string
}

export interface IEvent extends IBaseEntity {
  name: string,
  date: Date,
  location: ILocation,
  attendees: string[]
}

export interface IActivity extends IBaseEntity {
  date: Date,
  location: ILocation,
  activityType: IActivityType,
  durationInSeconds: number,
  distanceInMeters: number,
  comments: IComment[],
  likes: string[]
}
