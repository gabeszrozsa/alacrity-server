import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import Location from '../models/Location';
import Activity from '../models/Activity';
import ActivityType from '../models/ActivityType';
import { IEvent, ILocation, IActivity, IActivityType, IComment } from '../entities/';

export default class ActivityController {
  constructor() {
    this.getActivity = this.getActivity.bind(this);
    this.getAllActivities = this.getAllActivities.bind(this);
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
        console.log('[ERROR] - ActivityController :: getActivity');
      }

    });
  }

  // public deleteEvent(req: Request, res: Response) {
  //   const id = req.params.id;
  //
  //   if (!Event.validateID(id)) {
  //       return res.status(404).send();
  //   }
  //
  //   Event.deleteOne({ _id: id }, (err, result) => {
  //     if(err){
  //       res.send(err);
  //     }
  //     res.json({ message: 'Successfully deleted event!'});
  //   });
  // }
  //
  // public updateEvent(req: Request, res: Response) {
  //   Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
  //     if(err){
  //       res.send(err);
  //     }
  //     res.json(result);
  //   });
  // }
  //
  // public inviteUsers(req: Request, res: Response) {
  //   const id = req.params.id;
  //   const attendees = req.body.attendees;
  //
  //   Event.findOneAndUpdate({ _id: id }, { $addToSet: {attendees: attendees }},
  //     { new: true }, (err, result) => {
  //       if(err){
  //         res.send(err);
  //       }
  //       res.json(result);
  //   });
  // }
  //

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
