import * as express from "express";
import * as path from "path";
import UserController from "../controllers/UserController";
import LocationController from "../controllers/LocationController";
import ActivityTypeController from "../controllers/ActivityTypeController";
import EventController from "../controllers/EventController";
import ActivityController from "../controllers/ActivityController";
import MessageController from "../controllers/MessageController";

export class Routes {
    public userCtrl: UserController = new UserController();
    public locationCtrl: LocationController = new LocationController();
    public activityTypeCtrl: ActivityTypeController = new ActivityTypeController();
    public eventCtrl: EventController = new EventController();
    public activityCtrl: ActivityController = new ActivityController();
    public messageCtrl: MessageController = new MessageController();

    public routes(app): void {
      this.setUserRoutes(app);
      this.setLocationRoutes(app);
      this.setActivityTypeRoutes(app);
      this.setEventRoutes(app);
      this.setActivityRoutes(app);
      this.setMessageRoutes(app);

      if (process.env.NODE_ENV === 'production') {
        // Serve static files from the React frontend app
        app.use(express.static(path.join(__dirname, 'client/build')));
        // Anything that doesn't match the above, send back index.html
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname + '/client/build/index.html'));
        })
      }
    }

    public setUserRoutes(app): void {
      app.post('/api/users/new', this.userCtrl.addNewUser);
      app.post('/api/users/login', this.userCtrl.loginWithUser);
      app.delete('/api/users/logout', this.userCtrl.authenticate, this.userCtrl.logOut);
      app.get('/api/users/all', this.userCtrl.authenticate, this.userCtrl.getAllUsers);
      app.get('/api/users/current', this.userCtrl.authenticate, this.userCtrl.getCurrent);
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
      app.get('/api/event/:id/attendees', this.userCtrl.authenticate, this.eventCtrl.getAttendees);
      app.post('/api/event/:id/cancel', this.userCtrl.authenticate, this.eventCtrl.cancelEvent);
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
	    app.post('/api/activity/:id/like', this.userCtrl.authenticate, this.activityCtrl.addLike);
      app.get('/api/activity/:id/like', this.userCtrl.authenticate, this.activityCtrl.getLikes);
      app.delete('/api/activity/:id/like/:like', this.userCtrl.authenticate, this.activityCtrl.deleteLike);
    }

    public setMessageRoutes(app): void {
      app.get('/api/messages', this.userCtrl.authenticate, this.messageCtrl.getMyMessages);
      app.post('/api/messages', this.userCtrl.authenticate, this.messageCtrl.sendMessage);
      app.delete('/api/messages/:id', this.userCtrl.authenticate, this.messageCtrl.deleteMessage);
    }
}
