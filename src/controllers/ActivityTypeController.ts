import { Request, Response } from 'express';
import { IActivityTypeCreate, IActivityTypeView } from 'entities/activity-type';
import { ActivityTypeRepository } from '../repositories';

export default class ActivityTypeController {

  public addNewActivityType(req: Request, res: Response) {
    const activityTypeCreate: IActivityTypeCreate = {
      name: req.body.name,
      createdBy: req.body.user._id
    };

    ActivityTypeRepository.createActivityType(activityTypeCreate)
      .then(id => res.send(id))
      .catch(error => res.status(400).send(error))
  }

  public getAllActivityTypes(req: Request, res: Response) {
    ActivityTypeRepository.getAllActivityTypes()
      .then((activities: IActivityTypeView[]) => res.json(activities))
      .catch(error => res.status(400).send(error));
  }

  public getActivityType(req: Request, res: Response) {
    const id = req.params.id;

    ActivityTypeRepository.getActivityType(id)
      .then((activity: IActivityTypeView) => res.json(activity))
      .catch(error => res.status(404).send(error));
  }

  public deleteActivityType(req: Request, res: Response) {
    const id = req.params.id;

    ActivityTypeRepository.deleteActivityType(id)
      .then(() => res.status(200).send())
      .catch(error => res.status(404).send(error));
  }

  public updateActivityType(req: Request, res: Response) {
    const id = req.params.id;

    const data: IActivityTypeCreate = {
      name: req.body.name,
    };

    ActivityTypeRepository.updateActivityType(id, data)
      .then(id => res.send(id))
      .catch(error => res.status(404).send(error));
  }
}
