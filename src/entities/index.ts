interface IBaseEntity {
  _id: string,
  createdBy: string,
  createdAt: Date
}

export interface IActivityType extends IBaseEntity {
  name: string,
}

export interface IComment extends IBaseEntity {
  text: string,
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
