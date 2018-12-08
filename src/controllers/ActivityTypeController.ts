import { Request, Response, NextFunction } from 'express';
import ActivityType from '../models/ActivityType';
import { IActivityTypeCreate, IActivityTypeView } from 'entities/activity-type';

export default class ActivityTypeController {

  public addNewActivityType(req: Request, res: Response) {
    const activityTypeCreate: IActivityTypeCreate = {
      name: req.body.name,
      createdBy: req.body.user._id
    };
    const newActivityType = new ActivityType(activityTypeCreate);

    newActivityType.save()
      .then(token => res.send(newActivityType._id))
      .catch(error => res.status(400).send(error));
  }

  public getAllActivityTypes(req: Request, res: Response) {
    ActivityType.find({}, (err, result: IActivityTypeView) => {
      if(err){
          res.send(err);
      }
      res.json(result);
    });
  }

  public getActivityType(req: Request, res: Response) {
    const id = req.params.id;

    if (!ActivityType.validateID(id)) {
        return res.status(404).send();
    }

    ActivityType.findById(id).then((result: IActivityTypeView) => {
      if(!result){
          res.status(404).send();
      }
      res.json(result);
    });
  }

  public deleteActivityType(req: Request, res: Response) {
    const id = req.params.id;

    if (!ActivityType.validateID(id)) {
        return res.status(404).send();
    }

    ActivityType.deleteOne({ _id: id }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.status(200).send();
    });
  }

  public updateActivityType(req: Request, res: Response) {
    const id = req.params.id;

    if (!ActivityType.validateID(id)) {
        return res.status(404).send();
    }
    
    ActivityType.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result: IActivityTypeView) => {
      if(err){
        res.send(err);
      }
      res.json(result);
    });
  }

}
