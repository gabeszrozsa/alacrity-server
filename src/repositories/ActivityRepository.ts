import { IActivityCreate, IActivityView } from '../entities';
import Activity from '../models/Activity';

export default class ActivityRepository {

  public static createActivity(activity: IActivityCreate) {
    return new Promise((resolve, reject) => {
      const newActivity = new Activity(activity);
  
      newActivity.save()
        .then(token => resolve(newActivity._id))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: createActivity | activity: ', activity);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getAllActivities(userId = null) {
    const findQuery = (userId) ? { createdBy: userId } : {}; 

    return new Promise((resolve, reject) => {
      Activity
        .find(findQuery)
        .populate('createdBy', 'displayName')
        .populate('activityType_id', 'name')
        .populate('location_id', 'name')
        .exec()
        .then((activities: IActivityView[]) => {
          resolve(activities);
        })
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: getAllActivities | userId: ', userId);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getMyActivities(userId) {
    return this.getAllActivities(userId);
  }
  
  public static getActivity(id: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }

    return new Promise((resolve, reject) => {
      Activity
        .findById(id)
        .populate('createdBy', 'displayName')
        .populate('activityType_id', 'name')
        .populate('location_id')
        .then((activity: IActivityView) => resolve(activity))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: getActivity | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteActivity(id: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity.deleteOne({ _id: id })
        .then(() => resolve())
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: deleteActivity | id: ', id);
          console.log(error);
          reject(error)
        });
    });
  }
}