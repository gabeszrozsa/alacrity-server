import { Request, Response } from 'express';
import { Event, Location, Activity, ActivityType, User } from '../models/';
import { IEventView, ILocationView, IActivityView, IActivityCreate, IActivityTypeView, IComment, IUser, ILike } from '../entities/';
import { ActivityRepository } from '../repositories';

export default class ActivityController {
  constructor() {
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
    const data: IActivityCreate = {
      date: req.body.date,
      location_id: req.body.location_id,
      activityType_id: req.body.activityType_id,
      durationInSeconds: req.body.durationInSeconds,
      distanceInMeters: req.body.distanceInMeters,
      createdBy: req.body.user._id
    };

    ActivityRepository.createActivity(data)
      .then(id => res.send(id))
      .catch(error => res.status(400).send(error))
  }

  public getAllActivities(req: Request, res: Response) {
    ActivityRepository.getAllActivities()
      .then((activities: IActivityView) => res.json(activities))
      .catch(error => res.status(400).send(error))
  }

  public getMyActivities(req: Request, res: Response) {
    const currentUser = req.body.user._id;

    ActivityRepository.getAllActivities(currentUser)
      .then((activities: IActivityView) => res.json(activities))
      .catch(error => res.status(400).send(error))
  }

  public getActivity(req: Request, res: Response) {
    const id = req.params.id;

    ActivityRepository.getActivity(id)
      .then((activity: IActivityView) => res.json(activity))
      .catch(error => res.status(400).send(error));
  }

  public deleteActivity(req: Request, res: Response) {
    const id = req.params.id;

    ActivityRepository.deleteActivity(id)
      .then((activity: IActivityView) => res.json(activity))
      .catch(error => res.status(400).send(error));
  }

  public updateActivity(req: Request, res: Response) {
    const id = req.params.id;

    if (!Activity.validateID(id)) {
        return res.status(404).send();
    }
    
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

  private createActivity(activity: IActivityView, location: ILocationView, activityType: IActivityTypeView): IActivityView {
    return <IActivityView>{
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
    return new Promise<ILocationView>((resolve, reject) => {
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
    return new Promise<IActivityTypeView>((resolve, reject) => {
      ActivityType.findById(activityType_id).then(result => {
        if (!result){
            reject(`No ActivityType with ID: ${activityType_id}`);
        }
        resolve(result);
      });
    });
  }
}
