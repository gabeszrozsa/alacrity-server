interface IBaseEntity {
  _id: string,
  createdBy: string,
  createdAt: Date
}

export interface ILike {
  _id: string,
  createdAt: Date,
  createdBy: IUser
}

export interface IUser {
  _id: string,
  email: string,
  displayName: string
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

export interface ILatLng {
  lat: number,
  lng: number
}

export interface ICoordinates {
  center: ILatLng,
  routeCoords: ILatLng[],
  zoom: number
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
