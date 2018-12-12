import { IActivityTypeCreate, IActivityTypeView } from '../entities';
import ActivityType from '../models/Activity';

export default class ActivityTypeRepository {

  public static createActivityType(activityType: IActivityTypeCreate) {
    return new Promise((resolve, reject) => {
      const newActivityType = new ActivityType(activityType);
  
      newActivityType.save()
        .then(token => resolve(newActivityType._id))
        .catch(error => {
          console.log('[ERROR] - ActivityTypeRepository :: createActivityType | activityType: ', activityType);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getAllActivityTypes() {
    return new Promise((resolve, reject) => {
      ActivityType
        .find({})
        .populate('createdBy', 'displayName')
        .exec()
        .then((at: IActivityTypeView[]) => {
          resolve(at);
        })
        .catch(error => {
          console.log('[ERROR] - ActivityTypeRepository :: getAllActivityTypes');
          console.log(error);
          reject(error)
        });
    });
  }

  public static getActivityType(id: string) {
    if (!ActivityType.validateID(id)) {
      Promise.reject();
    }

    return new Promise((resolve, reject) => {
      ActivityType
        .findById(id)
        .populate('createdBy', 'displayName')
        .then((activityType: IActivityTypeView) => resolve(activityType))
        .catch(error => {
          console.log('[ERROR] - ActivityTypeRepository :: getActivityType | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteActivityType(id: string) {
    if (!ActivityType.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      ActivityType.deleteOne({ _id: id })
        .then(() => resolve())
        .catch(error => {
          console.log('[ERROR] - ActivityTypeRepository :: deleteActivityType | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static updateActivityType(id: string, data: IActivityTypeCreate) {
    if (!ActivityType.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      ActivityType.findOneAndUpdate({ _id: id }, data, { new: true })
        .then((at: IActivityTypeView) => resolve(at))
        .catch(error => {
          console.log('[ERROR] - ActivityTypeRepository :: updateActivityType');
          console.log('id: | ', id);
          console.log('data: | ', data);
          console.log(error);
          reject(error)
        });
    });
  }
}