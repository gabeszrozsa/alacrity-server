import { Request, Response } from 'express';
import { ILocationCreate, ILocationView } from '../entities';
import { LocationRepository } from '../repositories';

export default class LocationController {

  public addNewLocation(req: Request, res: Response) {
    const locationCreate: ILocationCreate = {
      name: req.body.name,
      coordinates: req.body.coordinates,
      createdBy: req.body.user._id
    };

    LocationRepository.createLocation(locationCreate)
      .then(id => res.send(id))
      .catch(error => res.status(400).send(error))
  }

  public getAllLocations(req: Request, res: Response) {
    LocationRepository.getAllLocations()
      .then((locations: ILocationView[]) => res.json(locations))
      .catch(error => res.status(400).send(error));
  }

  public getLocation(req: Request, res: Response) {
    const id = req.params.id;

    LocationRepository.getLocation(id)
      .then((loc: ILocationView) => res.json(loc))
      .catch(error => res.status(404).send(error));
  }

  public deleteLocation(req: Request, res: Response) {
    const id = req.params.id;

    LocationRepository.deleteLocation(id)
      .then(() => res.status(200).send())
      .catch(error => res.status(404).send(error));
  }

  public updateLocation(req: Request, res: Response) {
    const id = req.params.id;

    const data: ILocationCreate = {
      name: req.body.name,
    };

    LocationRepository.updateLocation(id, data)
      .then(id => res.send(id))
      .catch(error => res.status(404).send(error));
  }

}
