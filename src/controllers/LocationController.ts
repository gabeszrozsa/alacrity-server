import { Request, Response, NextFunction } from 'express';
import Location from '../models/Location';

export default class LocationController {

  public addNewLocation(req: Request, res: Response) {
    const newLocation = new Location({
      name: req.body.name,
      coordinates: req.body.coordinates,
      createdBy: req.body.user._id
    });

    newLocation.save()
      .then(token => res.send(newLocation._id))
      .catch(error => res.status(400).send(error));
  }

  public getAllLocations(req: Request, res: Response) {
    Location.find({}, (err, result) => {
      if(err){
          res.send(err);
      }
      res.json(result);
    });
  }

  public getLocation(req: Request, res: Response) {
    const id = req.params.id;

    if (!Location.validateID(id)) {
        return res.status(404).send();
    }

    Location.findById(id).then(result => {
      if(!result){
          res.status(404).send();
      }
      res.json(result);
    });
  }

  public deleteLocation(req: Request, res: Response) {
    const id = req.params.id;

    if (!Location.validateID(id)) {
        return res.status(404).send();
    }

    Location.deleteOne({ _id: id }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json({ message: 'Successfully deleted location!'});
    });
  }

  public updateLocation(req: Request, res: Response) {
    const id = req.params.id;

    if (!Location.validateID(id)) {
        return res.status(404).send();
    }
    
    Location.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json(result);
    });
  }

}
