import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import Location from '../models/Location';
import { IEvent, ILocation } from '../entities/';

export default class EventController {
  constructor() {
    this.getEvent = this.getEvent.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
  }

  public addNewEvent(req: Request, res: Response) {
    const newEvent = new Event({
      name: req.body.name,
      date: req.body.date,
      location_id: req.body.location_id,
      attendees: req.body.attendees,
      createdBy: req.body.user._id
    });

    newEvent.save()
      .then(token => res.send(newEvent._id))
      .catch(error => res.status(400).send(error));
  }

  public getAllEvents(req: Request, res: Response) {
    Event.find({}, async (err, events) => {
      if (err) {
          res.send(err);
      }

      const results: IEvent[] = [];
      for (let event of events) {
        try {
          const location = await this.getLocationForEvent(event.location_id);
          const result = this.mapEventWithLocation(event, location);
          results.push(result);
        } catch (error) {
          console.log('[ERROR] - EventController :: getAllEvents');
        }
      }

      res.json(results);
    });
  }

  public getEvent(req: Request, res: Response) {
    const id = req.params.id;

    if (!Event.validateID(id)) {
        return res.status(404).send();
    }

    Event.findById(id).then(event => {
      if (!event) {
          res.status(404).send();
      }
      this.getLocationForEvent(event.location_id)
        .then(location => {
          const result = this.mapEventWithLocation(event, location);
          res.json(result);
        })
        .catch(error => console.log('[ERROR] - EventController :: getEvent'));
    });
  }

  public deleteEvent(req: Request, res: Response) {
    const id = req.params.id;

    if (!Event.validateID(id)) {
        return res.status(404).send();
    }

    Event.deleteOne({ _id: id }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json({ message: 'Successfully deleted event!'});
    });
  }

  public updateEvent(req: Request, res: Response) {
    Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
      if(err){
        res.send(err);
      }
      res.json(result);
    });
  }

  public inviteUsers(req: Request, res: Response) {
    const id = req.params.id;
    const attendees = req.body.attendees;

    Event.findOneAndUpdate({ _id: id }, { $addToSet: {attendees: attendees }},
      { new: true }, (err, result) => {
        if(err){
          res.send(err);
        }
        res.json(result);
    });
  }

  private mapEventWithLocation(event: IEvent, location: ILocation): IEvent {
    return <IEvent>{
      _id: event._id,
      name: event.name,
      attendees: event.attendees,
      date: event.date,
      location: location,
      createdAt: event.createdAt,
      createdBy: event.createdBy,
    };
  }

  private getLocationForEvent(location_id: string) {
    return new Promise<ILocation>((resolve, reject) => {
      Location.findById(location_id).then(result => {
        if (!result){
            reject(`No Location with ID: ${location_id}`);
        }
        resolve(result);
      });
    });
  }
}
