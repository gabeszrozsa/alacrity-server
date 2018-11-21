"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../models/Event");
const User_1 = require("../models/User");
const Location_1 = require("../models/Location");
class EventController {
    constructor() {
        this.getEvent = this.getEvent.bind(this);
        this.getAllEvents = this.getAllEvents.bind(this);
        this.inviteUsers = this.inviteUsers.bind(this);
        this.getAttendees = this.getAttendees.bind(this);
        this.getAttendeesWithUsers = this.getAttendeesWithUsers.bind(this);
        this.cancelEvent = this.cancelEvent.bind(this);
    }
    addNewEvent(req, res) {
        const newEvent = new Event_1.default({
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
    getAllEvents(req, res) {
        Event_1.default
            .find()
            .sort('date')
            .exec()
            .then((events) => __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let event of events) {
                try {
                    const location = yield this.getLocationForEvent(event.location_id);
                    const result = this.mapEventWithLocation(event, location);
                    results.push(result);
                }
                catch (error) {
                    console.log('[ERROR] - EventController :: getAllEvents', event._id);
                    console.log('[ERROR] No location with ID', event.location_id);
                }
            }
            res.json(results);
        }))
            .catch(error => res.send(error));
    }
    getEvent(req, res) {
        const id = req.params.id;
        if (!Event_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Event_1.default.findById(id).then(event => {
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
    deleteEvent(req, res) {
        const id = req.params.id;
        if (!Event_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Event_1.default.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted event!' });
        });
    }
    updateEvent(req, res) {
        Event_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
    inviteUsers(req, res) {
        const id = req.params.id;
        const attendees = req.body.attendees;
        Event_1.default.findOneAndUpdate({ _id: id }, { $addToSet: { attendees: attendees } }, { new: true }, (err, event) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            const attendees = yield this.getAttendeesWithUsers(event.attendees);
            res.json(attendees);
        }));
    }
    getAttendees(req, res) {
        const id = req.params.id;
        if (!Event_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Event_1.default.findById(id).then((event) => __awaiter(this, void 0, void 0, function* () {
            if (!event) {
                res.status(404).send();
            }
            const attendees = yield this.getAttendeesWithUsers(event.attendees);
            res.json(attendees);
        }));
    }
    cancelEvent(req, res) {
        const _id = req.params.id;
        const attendee = req.body.attendee;
        Event_1.default.findOneAndUpdate({ _id }, { $pull: { attendees: attendee } }, { new: true }, (err, event) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            if (!event) {
                res.status(404).send();
            }
            const attendees = yield this.getAttendeesWithUsers(event.attendees);
            res.json(attendees);
        }));
    }
    mapEventWithLocation(event, location) {
        return {
            _id: event._id,
            name: event.name,
            attendees: event.attendees,
            date: event.date,
            location: location,
            createdAt: event.createdAt,
            createdBy: event.createdBy,
        };
    }
    getAttendeesWithUsers(attendeeList) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendees = [];
            for (let attendee of attendeeList) {
                try {
                    const user = yield this.getUser(attendee);
                    attendees.push(user);
                }
                catch (error) {
                    console.log('[ERROR] - EventController :: getAttendees', attendee, error);
                }
            }
            return attendees;
        });
    }
    getUser(user_id) {
        return new Promise((resolve, reject) => {
            User_1.default.findById(user_id)
                .then(result => resolve({ _id: result._id, email: result.email, displayName: result.displayName }))
                .catch(error => reject(`No User with ID: ${user_id}`));
        });
    }
    getLocationForEvent(location_id) {
        return new Promise((resolve, reject) => {
            Location_1.default.findById(location_id).then(result => {
                if (!result) {
                    reject(`No Location with ID: ${location_id}`);
                }
                resolve(result);
            });
        });
    }
}
exports.default = EventController;
//# sourceMappingURL=EventController.js.map