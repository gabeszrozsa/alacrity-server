import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import User from '../models/User';
import Location from '../models/Location';
import { IEvent, ILocation, IUser } from '../entities/';

export default class EventController {
  constructor() {
    this.getEvent = this.getEvent.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
    this.inviteUsers = this.inviteUsers.bind(this);
    this.getAttendees = this.getAttendees.bind(this);
    this.getAttendeesWithUsers = this.getAttendeesWithUsers.bind(this);
    this.cancelEvent = this.cancelEvent.bind(this);
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
      { new: true }, async (err, event) => {
        if(err){
          res.send(err);
        }

        const attendees = await this.getAttendeesWithUsers(event.attendees);
        res.json(attendees);
    });
  }

  public getAttendees(req: Request, res: Response) {
    const id = req.params.id;

    if (!Event.validateID(id)) {
        return res.status(404).send();
    }

    Event.findById(id).then(async (event) => {
      if (!event) {
          res.status(404).send();
      }

      const attendees = await this.getAttendeesWithUsers(event.attendees);
      res.json(attendees);
    });
  }

  public cancelEvent(req: Request, res: Response) {
    const _id = req.params.id;
    const attendee = req.body.attendee;

    Event.findOneAndUpdate(
      { _id },
      { $pull: { attendees: attendee } },
      { new: true },
      async (err, event) => {
        if (err) { res.send(err) }
        if (!event) { res.status(404).send() }

        const attendees = await this.getAttendeesWithUsers(event.attendees);
        res.json(attendees);
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

  private async getAttendeesWithUsers(attendeeList) {
    const attendees: IUser[] = [];
    for (let attendee of attendeeList) {
      try {
        const user: IUser = await this.getUser(attendee);
        attendees.push(user);
      } catch (error) {
        console.log('[ERROR] - EventController :: getAttendees', error);
      }
    }
    return attendees
  }

  private getUser(user_id: string) {
    return new Promise<IUser>((resolve, reject) => {
      User.findById(user_id)
      .then(result => resolve(
        { _id: result._id, email: result.email, displayName: result.displayName }
      ))
      .catch(error => reject(`No User with ID: ${user_id}`))
    });
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
