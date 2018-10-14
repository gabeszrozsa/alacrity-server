import {Request, Response} from "express";
import UserController from "../controllers/UserController";
import LocationController from "../controllers/LocationController";
import ActivityTypeController from "../controllers/ActivityTypeController";
import EventController from "../controllers/EventController";
import ActivityController from "../controllers/ActivityController";

export class Routes {
    public userCtrl: UserController = new UserController();
    public locationCtrl: LocationController = new LocationController();
    public activityTypeCtrl: ActivityTypeController = new ActivityTypeController();
    public eventCtrl: EventController = new EventController();
    public activityCtrl: ActivityController = new ActivityController();

    public routes(app): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        });

        this.setUserRoutes(app);
        this.setLocationRoutes(app);
        this.setActivityTypeRoutes(app);
        this.setEventRoutes(app);
        this.setActivityRoutes(app);
    }

    public setUserRoutes(app): void {
      app.post('/api/users/new', this.userCtrl.addNewUser);
      app.post('/api/users/login', this.userCtrl.loginWithUser);
      app.get('/api/users/current', this.userCtrl.authenticate, (req, res) => {
        res.send(req.body.user);
      });
    }

    public setLocationRoutes(app): void {
      app.post('/api/location', this.userCtrl.authenticate, this.locationCtrl.addNewLocation);
      app.get('/api/location', this.userCtrl.authenticate, this.locationCtrl.getAllLocations);
      app.get('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.getLocation);
      app.delete('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.deleteLocation);
      app.patch('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.updateLocation);
    }

    public setActivityTypeRoutes(app): void {
      app.post('/api/activity-type', this.userCtrl.authenticate, this.activityTypeCtrl.addNewActivityType);
      app.get('/api/activity-type', this.userCtrl.authenticate, this.activityTypeCtrl.getAllActivityTypes);
      app.get('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.getActivityType);
      app.delete('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.deleteActivityType);
      app.patch('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.updateActivityType);
    }

    public setEventRoutes(app): void {
      app.post('/api/event', this.userCtrl.authenticate, this.eventCtrl.addNewEvent);
      app.get('/api/event', this.userCtrl.authenticate, this.eventCtrl.getAllEvents);
      app.get('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.getEvent);
      app.delete('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.deleteEvent);
      app.patch('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.updateEvent);
      app.post('/api/event/:id/invite', this.userCtrl.authenticate, this.eventCtrl.inviteUsers);
    }

    public setActivityRoutes(app): void {
      app.post('/api/activity', this.userCtrl.authenticate, this.activityCtrl.addNewActivity);
      app.get('/api/activity', this.userCtrl.authenticate, this.activityCtrl.getAllActivities);
      app.get('/api/activity/:id', this.userCtrl.authenticate, this.activityCtrl.getActivity);
      app.delete('/api/activity/:id', this.userCtrl.authenticate, this.activityCtrl.deleteActivity);
      app.patch('/api/activity/:id', this.userCtrl.authenticate, this.activityCtrl.updateActivity);
      app.post('/api/activity/:id/comment', this.userCtrl.authenticate, this.activityCtrl.addComment);
      app.get('/api/activity/:id/comment', this.userCtrl.authenticate, this.activityCtrl.getComments);
      app.delete('/api/activity/:id/comment/:comment', this.userCtrl.authenticate, this.activityCtrl.deleteComment);
    }
}
