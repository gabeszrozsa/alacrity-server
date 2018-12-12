import { IActivityCreate, IActivityView, IComment, ILike } from '../entities';
import { Activity, ActivityType, Location, User } from '../models/';

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
        .populate('createdBy', 'displayName', User)
        .populate('activityType_id', 'name', ActivityType)
        .populate('location_id', 'name', Location)
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
        .populate('createdBy', 'displayName', User)
        .populate('activityType_id', 'name', ActivityType)
        .populate('location_id', 'name coordinates createdBy', Location)
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

  public static updateActivity(id: string, data: IActivityCreate) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity.findOneAndUpdate({ _id: id }, data, { new: true })
        .then((activity: IActivityView) => resolve(activity))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: updateActivity');
          console.log('id: | ', id);
          console.log('data: | ', data);
          console.log(error);
          reject(error)
        });
    });
  }

  public static addComment(id: string, comment: IComment) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findOneAndUpdate({ _id: id }, { $push: {comments: comment } }, { new: true })
        .populate('comments.createdBy', 'displayName', User)
        .then((activity: IActivityView) => resolve(activity.comments))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: addComment');
          console.log('id: | ', id);
          console.log('comment: | ', comment);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getComments(id: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findById(id)
        .populate('comments.createdBy', 'displayName', User)
        .then((activity: IActivityView) => resolve(activity.comments))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: getComments');
          console.log('id: | ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteComment(id: string, commentId: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findOneAndUpdate(
          { _id: id },
          { $pull: { comments: { _id: commentId }}},
          { new: true }
        )
        .populate('comments.createdBy', 'displayName', User)
        .then((activity: IActivityView) => resolve(activity.comments))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: deleteComment');
          console.log('id: | ', id);
          console.log('commentId: | ', commentId);
          console.log(error);
          reject(error)
        });
    });
  }

  public static addLike(id: string, like: ILike) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findOneAndUpdate(
          { _id: id, 'likes.createdBy': { $ne: like.createdBy } }, 
          { $addToSet: { likes: like } }, 
          { new: true }
        )
        .populate('likes.createdBy', 'displayName', User)
        .then((activity: IActivityView) => {
          const likes = activity ? activity.likes : [];
          resolve(likes);
        })
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: addLike');
          console.log('id: | ', id);
          console.log('like: | ', like);
          console.log(error);
          reject(error)
        });
    });
  }

  public static getLikes(id: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findById(id)
        .populate('likes.createdBy', 'displayName', User)
        .then((activity: IActivityView) => resolve(activity.likes))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: getLikes');
          console.log('id: | ', id);
          console.log(error);
          reject(error)
        });
    });
  }

  public static deleteLike(id: string, likeId: string) {
    if (!Activity.validateID(id)) {
      Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      Activity
        .findOneAndUpdate(
          { _id: id },
          { $pull: { likes: { _id: likeId } } },
          { new: true }
        )
        .populate('likes.createdBy', 'displayName', User)
        .then((activity: IActivityView) => resolve(activity.likes))
        .catch(error => {
          console.log('[ERROR] - ActivityRepository :: deleteLike');
          console.log('id: | ', id);
          console.log('likeId: | ', likeId);
          console.log(error);
          reject(error)
        });
    });
  }

}