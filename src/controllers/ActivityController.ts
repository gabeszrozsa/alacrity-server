import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import Location from '../models/Location';
import Activity from '../models/Activity';
import ActivityType from '../models/ActivityType';
import User from '../models/User';
import { IEvent, ILocation, IActivity, IActivityType, IComment, IUser, ILike } from '../entities/';

export default class ActivityController {
  constructor() {
    this.getActivity = this.getActivity.bind(this);
    this.getAllActivities = this.getAllActivities.bind(this);
    this.getComments = this.getComments.bind(this);
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.getLikes = this.getLikes.bind(this);
    this.addLike = this.addLike.bind(this);
    this.deleteLike = this.deleteLike.bind(this);
    this.getLikesWithUsers = this.getLikesWithUsers.bind(this);
    this.getCommentsWithUsers = this.getCommentsWithUsers.bind(this);
  }

  public addNewActivity(req: Request, res: Response) {
    const newActivity = new Activity({
      date: req.body.date,
      location_id: req.body.location_id,
      activityType_id: req.body.activityType_id,
      durationInSeconds: req.body.durationInSeconds,
      distanceInMeters: req.body.distanceInMeters,
      createdBy: req.body.user._id
    });

    newActivity.save()
      .then(token => res.send(newActivity._id))
      .catch(error => res.status(400).send(error));
  }

  public getAllActivities(req: Request, res: Response) {
    Activity.find({}, async (err, activities) => {
      if (err) {
          res.send(err);
      }

      const results: IActivity[] = [];
      for (let activity of activities) {
        try {
          const data = await Promise.all([
            this.getLocation(activity.location_id),
            this.getActivityType(activity.activityType_id)
          ]);

          const location: ILocation = data[0];
          const activityType: IActivityType = data[1];
          const result = this.createActivity(activity, location, activityType);
          results.push(result);
        } catch (error) {
          console.log('[ERROR] - ActivityController :: getAllActivities');
        }
      }

      res.json(results);
    });
  }

  public getActivity(req: Request, res: Response) {
    const id = req.params.id;

    if (!Activity.validateID(id)) {
        return res.status(404).send();
    }

    Activity.findById(id).then(async (activity) => {
      if (!activity) {
          res.status(404).send();
      }

      try {
        const data = await Promise.all([
          this.getLocation(activity.location_id),
          this.getActivityType(activity.activityType_id)
        ]);

        const location: ILocation = data[0];
        const activityType: IActivityType = data[1];
        const result = this.createActivity(activity, location, activityType);
        res.json(result);
      } catch (error) {
        console.log('[ERROR] - ActivityController :: getActivity', error);
      }

    });
  }

  public deleteActivity(req: Request, res: Response) {
    const id = req.params.id;

    if (!Activity.validateID(id)) {
        return res.status(404).send();
    }

    Activity.deleteOne({ _id: id }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json({ message: 'Successfully deleted activity!'});
    });
  }

  public updateActivity(req: Request, res: Response) {
    Activity.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json(result);
    });
  }

  public addComment(req: Request, res: Response) {
    const id = req.params.id;
    const comment = {
      text: req.body.text,
      createdBy: req.body.user._id
    };

    Activity.findOneAndUpdate({ _id: id }, { $push: {comments: comment }},
      { new: true }, async (err, activity) => {
        if(err){
          res.send(err);
        }

        const comments = await this.getCommentsWithUsers(activity.comments);
        res.json(comments);
    });
  }

  public getComments(req: Request, res: Response) {
    const id = req.params.id;

    if (!Activity.validateID(id)) {
        return res.status(404).send();
    }

    Activity.findById(id).then(async (activity) => {
      if (!activity) {
          res.status(404).send();
      }

      const comments = await this.getCommentsWithUsers(activity.comments);
      res.json(comments);
    });
  }

  public deleteComment(req: Request, res: Response) {
    const id = req.params.id;
    const commentId = req.params.comment;

    Activity.findOneAndUpdate(
      { _id: id },
      { $pull: { comments: { _id: commentId }}},
      { new: true },
      async (err, activity) => {
        if(err){
          res.send(err);
        }

        const comments = await this.getCommentsWithUsers(activity.comments);
        res.json(comments);
    });
  }

  public addLike(req: Request, res: Response) {
    const _id = req.params.id;
    const createdBy = req.body.user._id;
    const like = { createdBy };

    Activity.findOneAndUpdate(
      { _id, 'likes.createdBy': { $ne: createdBy } },
      { $addToSet: {likes: like}},
      { new: true },
      async (err, activity) => {
        if (err) { res.send(err) }
        if (!activity) { res.status(404).send() }

        const likes = await this.getLikesWithUsers(activity.likes);
        res.json(likes);
    });
  }

  public getLikes(req: Request, res: Response) {
    const id = req.params.id;

    if (!Activity.validateID(id)) {
        return res.status(404).send();
    }

    Activity.findById(id).then(async (activity) => {
      if (!activity) {
          res.status(404).send();
      }

      const likes = await this.getLikesWithUsers(activity.likes);

      res.json(likes);
    });
  }

  public deleteLike(req: Request, res: Response) {
    const _id = req.params.id;
    const likeId = req.params.like;

    Activity.findOneAndUpdate(
      { _id },
      { $pull: { likes: { _id: likeId } } },
      { new: true },
      async (err, activity) => {
        if (err) { res.send(err) }
        if (!activity) { res.status(404).send() }

      const likes = await this.getLikesWithUsers(activity.likes);
      res.json(likes);
    });
  }

  private async getCommentsWithUsers(activityComments) {
    const comments: IComment[] = [];
    for (let comment of activityComments) {
      try {
        const user: IUser = await this.getUser(comment.createdBy);
        const result: IComment = {
          _id: comment._id,
          text: comment.text,
          createdAt: comment.createdAt,
          createdBy: user
        };

        comments.push(result);
      } catch (error) {
        console.log('[ERROR] - ActivityController :: getCommentsWithUsers', error);
      }
    }
    return comments;
  }

  private async getLikesWithUsers(likes) {
    const data: ILike[] = [];
    for (let like of likes) {
      try {
        const user: IUser = await this.getUser(like.createdBy);
        const result: ILike = {
          _id: like._id,
          createdAt: like.createdAt,
          createdBy: user
        };

        data.push(result);
      } catch (error) {
        console.log('[ERROR] - ActivityController :: getLikesWithUsers', error);
      }
    }
    return data;
  }

  private createActivity(activity: IActivity, location: ILocation, activityType: IActivityType): IActivity {
    return <IActivity>{
      _id: activity._id,
      date: activity.date,
      location: location,
      activityType: activityType,
      durationInSeconds: activity.durationInSeconds,
      distanceInMeters: activity.distanceInMeters,
      comments: activity.comments,
      likes: activity.likes,
      createdAt: activity.createdAt,
      createdBy: activity.createdBy,
    };
  }

  private getLocation(location_id: string) {
    return new Promise<ILocation>((resolve, reject) => {
      Location.findById(location_id).then(result => {
        if (!result){
            reject(`No Location with ID: ${location_id}`);
        }
        resolve(result);
      });
    });
  }

  private getUser(user_id: string) {
    return new Promise<IUser>((resolve, reject) => {
      User.findById(user_id).then(result => {
        if (!result){
            reject(`No User with ID: ${user_id}`);
        }
        resolve({ _id: result._id, email: result.email, displayName: result.displayName });
      });
    });
  }

  private getActivityType(activityType_id: string) {
    return new Promise<IActivityType>((resolve, reject) => {
      ActivityType.findById(activityType_id).then(result => {
        if (!result){
            reject(`No ActivityType with ID: ${activityType_id}`);
        }
        resolve(result);
      });
    });
  }
}
