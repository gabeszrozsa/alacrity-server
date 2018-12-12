import { IActivityTypeView, IActivityTypeCreate } from './activity-type';
import { ILatLng, ICoordinates, ILocationCreate, ILocationView } from './location';
import { IUser, ICurrentUser, IRegisterUser, ILoginUser } from './user';
import { IEventCreate, IEventView } from './event';
import { IActivityCreate, IActivityView, IComment, ILike } from './activity';

export interface IBaseEntity {
  _id: string,
  createdBy: string,
  createdAt: Date
}

export {
  IActivityTypeView, IActivityTypeCreate,
  ILatLng, ICoordinates, ILocationCreate, ILocationView,
  IUser, ICurrentUser, IRegisterUser, ILoginUser,
  IActivityCreate, IActivityView, IComment, ILike,
  IEventCreate, IEventView
};