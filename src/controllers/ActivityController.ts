import { Request, Response } from 'express';
import { IActivityView, IActivityCreate, IComment, ILike } from '../entities/';
import { ActivityRepository } from '../repositories';

export default class ActivityController {

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
      .catch(error => res.status(404).send(error));
  }

  public deleteActivity(req: Request, res: Response) {
    const id = req.params.id;

    ActivityRepository.deleteActivity(id)
      .then(() => res.status(200).send())
      .catch(error => res.status(404).send(error));
  }

  public updateActivity(req: Request, res: Response) {
    const id = req.params.id;
    const data: IActivityCreate = {
      date: req.body.date,
      location_id: req.body.location_id,
      activityType_id: req.body.activityType_id,
      durationInSeconds: req.body.durationInSeconds,
      distanceInMeters: req.body.distanceInMeters,
    };

    ActivityRepository.updateActivity(id, data)
      .then(id => res.send(id))
      .catch(error => res.status(404).send(error));
  }

  public addComment(req: Request, res: Response) {
    const id = req.params.id;
    const comment: IComment = {
      text: req.body.text,
      createdBy: req.body.user._id
    };

    ActivityRepository.addComment(id, comment)
      .then((comments: IComment[]) => res.json(comments))
      .catch(error => res.status(400).send(error));
  }

  public getComments(req: Request, res: Response) {
    const id = req.params.id;

    ActivityRepository.getComments(id)
      .then((comments: IComment[]) => res.json(comments))
      .catch(error => res.status(400).send(error));
  }

  public deleteComment(req: Request, res: Response) {
    const id = req.params.id;
    const commentId = req.params.comment;

    ActivityRepository.deleteComment(id, commentId)
      .then((comments: IComment[]) => res.json(comments))
      .catch(error => res.status(400).send(error));
  }

  public addLike(req: Request, res: Response) {
    const id = req.params.id;
    const like: ILike = {
      createdBy: req.body.user._id
    };

    ActivityRepository.addLike(id, like)
      .then((likes: ILike[]) => res.json(likes))
      .catch(error => res.status(400).send(error));
  }

  public getLikes(req: Request, res: Response) {
    const id = req.params.id;

    ActivityRepository.getLikes(id)
      .then((likes: ILike[]) => res.json(likes))
      .catch(error => res.status(400).send(error));
  }

  public deleteLike(req: Request, res: Response) {
    const id = req.params.id;
    const likeId = req.params.like;

    ActivityRepository.deleteLike(id, likeId)
      .then((likes: ILike[]) => res.json(likes))
      .catch(error => res.status(400).send(error));
  }

}
