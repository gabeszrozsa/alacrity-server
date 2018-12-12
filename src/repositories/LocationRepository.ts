import { ILocationCreate, ILocationView } from '../entities';
import { Location } from '../models/';

export default class LocationRepository {
  
  public static createLocation(location: ILocationCreate) {
    return new Promise((resolve, reject) => {
      const newLocation = new Location(location);
  
      newLocation.save()
        .then(token => resolve(newLocation._id))
        .catch(error => {
          console.log('[ERROR] - LocationRepository :: createLocation | location: ', location);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getAllLocations() {
    return new Promise((resolve, reject) => {
      Location
        .find({})
        .exec()
        .then((loc: ILocationView[]) => {
          resolve(loc);
        })
        .catch(error => {
          console.log('[ERROR] - LocationRepository :: getAllLocations');
          console.log(error);
          reject(error)
        });
    });
  }

  public static getLocation(id: string) {
    if (!Location.validateID(id)) {
      Promise.reject();
    }

    return new Promise((resolve, reject) => {
      Location
        .findById(id)
        .then((location: ILocationView) => resolve(location))
        .catch(error => {
          console.log('[ERROR] - LocationRepository :: getLocation | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteLocation(id: string) {
    if (!Location.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Location.deleteOne({ _id: id })
        .then(() => resolve())
        .catch(error => {
          console.log('[ERROR] - LocationRepository :: deleteLocation | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static updateLocation(id: string, data: ILocationCreate) {
    if (!Location.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Location.findOneAndUpdate({ _id: id }, data, { new: true })
        .then((loc: ILocationView) => resolve(loc))
        .catch(error => {
          console.log('[ERROR] - LocationRepository :: updateLocation');
          console.log('id: | ', id);
          console.log('data: | ', data);
          console.log(error);
          reject(error)
        });
    });
  }
}