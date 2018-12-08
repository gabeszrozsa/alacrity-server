import { IBaseEntity } from './';

export interface ILatLng {
  lat: number,
  lng: number
}

export interface ICoordinates {
  center: ILatLng,
  routeCoords: ILatLng[],
  zoom: number
}

export interface ILocationCreate {
  name: string,
  coordinates: ICoordinates,
  createdBy: string
}

export interface ILocationView extends ILocationCreate, IBaseEntity {}