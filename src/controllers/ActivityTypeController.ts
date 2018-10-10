import { Request, Response, NextFunction } from 'express';
import ActivityType from '../models/ActivityType';

export default class ActivityTypeController {

  public addNewActivityType(req: Request, res: Response) {
    const newActivityType = new ActivityType({
      name: req.body.name,
      createdBy: req.body.user._id
    });

    newActivityType.save()
      .then(token => res.send(newActivityType._id))
      .catch(error => res.status(400).send(error));
  }

  public getAllActivityTypes(req: Request, res: Response) {
    ActivityType.find({}, (err, result) => {
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

    ActivityType.findById(id).then(result => {
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
      res.json({ message: 'Successfully deleted activity type!'});
    });
  }

  public updateActivityType(req: Request, res: Response) {
    ActivityType.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json(result);
    });
  }

}
