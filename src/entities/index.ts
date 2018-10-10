interface IBaseEntity {
  _id: string,
  createdBy: string,
  createdAt: Date
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
