"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const LocationController_1 = require("../controllers/LocationController");
const ActivityTypeController_1 = require("../controllers/ActivityTypeController");
const EventController_1 = require("../controllers/EventController");
const ActivityController_1 = require("../controllers/ActivityController");
const MessageController_1 = require("../controllers/MessageController");
class Routes {
    constructor() {
        this.userCtrl = new UserController_1.default();
        this.locationCtrl = new LocationController_1.default();
        this.activityTypeCtrl = new ActivityTypeController_1.default();
        this.eventCtrl = new EventController_1.default();
        this.activityCtrl = new ActivityController_1.default();
        this.messageCtrl = new MessageController_1.default();
    }
    routes(app) {
        app.route('/')
            .get((req, res) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            });
        });
        this.setUserRoutes(app);
        this.setLocationRoutes(app);
        this.setActivityTypeRoutes(app);
        this.setEventRoutes(app);
        this.setActivityRoutes(app);
        this.setMessageRoutes(app);
    }
    setUserRoutes(app) {
        app.post('/api/users/new', this.userCtrl.addNewUser);
        app.post('/api/users/login', this.userCtrl.loginWithUser);
        app.get('/api/users/all', this.userCtrl.authenticate, this.userCtrl.getAllUsers);
        app.get('/api/users/current', this.userCtrl.authenticate, (req, res) => {
            const { _id, email, displayName } = req.body.user;
            res.send({ _id, email, displayName });
        });
    }
    setLocationRoutes(app) {
        app.post('/api/location', this.userCtrl.authenticate, this.locationCtrl.addNewLocation);
        app.get('/api/location', this.userCtrl.authenticate, this.locationCtrl.getAllLocations);
        app.get('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.getLocation);
        app.delete('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.deleteLocation);
        app.patch('/api/location/:id', this.userCtrl.authenticate, this.locationCtrl.updateLocation);
    }
    setActivityTypeRoutes(app) {
        app.post('/api/activity-type', this.userCtrl.authenticate, this.activityTypeCtrl.addNewActivityType);
        app.get('/api/activity-type', this.userCtrl.authenticate, this.activityTypeCtrl.getAllActivityTypes);
        app.get('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.getActivityType);
        app.delete('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.deleteActivityType);
        app.patch('/api/activity-type/:id', this.userCtrl.authenticate, this.activityTypeCtrl.updateActivityType);
    }
    setEventRoutes(app) {
        app.post('/api/event', this.userCtrl.authenticate, this.eventCtrl.addNewEvent);
        app.get('/api/event', this.userCtrl.authenticate, this.eventCtrl.getAllEvents);
        app.get('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.getEvent);
        app.delete('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.deleteEvent);
        app.patch('/api/event/:id', this.userCtrl.authenticate, this.eventCtrl.updateEvent);
        app.post('/api/event/:id/invite', this.userCtrl.authenticate, this.eventCtrl.inviteUsers);
        app.get('/api/event/:id/attendees', this.userCtrl.authenticate, this.eventCtrl.getAttendees);
        app.post('/api/event/:id/cancel', this.userCtrl.authenticate, this.eventCtrl.cancelEvent);
    }
    setActivityRoutes(app) {
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
    setMessageRoutes(app) {
        app.get('/api/messages', this.userCtrl.authenticate, this.messageCtrl.getMyMessages);
        app.post('/api/messages', this.userCtrl.authenticate, this.messageCtrl.sendMessage);
        app.delete('/api/messages/:id', this.userCtrl.authenticate, this.messageCtrl.deleteMessage);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map