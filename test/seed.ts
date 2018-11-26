import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { User, Location, ActivityType, Event, Message, Activity } from '../src/models/index';

const userOneId = new ObjectID();
const token = jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString();
const newUser = {
  _id: userOneId,
  email: 'gabesz@email.com',
  password:'userOnePass',
  displayName: 'Gabesz',
  tokens: [{
    access: 'auth',
    token: token
  }]
};

const userTwoId = new ObjectID();
const anotherToken = jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString();
const anotherUser = {
  _id: userTwoId,
  email: 'arrow@email.com',
  password:'userTwoPass',
  displayName: 'Oliver Queen',
  tokens: [{
    access: 'auth',
    token: anotherToken
  }]
};

const populateUsers = function(done) {
  this.timeout(0);
  User.remove({})
    .then(() => { new User(newUser).save() })
    .then(() => { new User(anotherUser).save() })
    .then(() => { done() })
};

const locId = new ObjectID();
const newLocation = {
  _id: locId,
  name: "loc",
  coordinates : {
    center : {
        lat : 47.4764568,
        lng : 19.0415054
    },
    routeCoords : [ 
        {
            lat : 47.4777910675768,
            lng : 19.0420096552948
        }, 
        {
            lat : 47.4776569172057,
            lng : 19.0422456896881
        }, 
        {
            lat : 47.476978908739,
            lng : 19.0420579350571
        }, 
        {
            lat : 47.4768157503153,
            lng : 19.0420257485489
        }, 
        {
            lat : 47.4763879102651,
            lng : 19.0420257485489
        }, 
        {
            lat : 47.4761739889336,
            lng : 19.041870180426
        }, 
        {
            lat : 47.4759093054028,
            lng : 19.0414785779099
        }, 
        {
            lat : 47.4760108280106,
            lng : 19.0409850514511
        }, 
        {
            lat : 47.4763661555932,
            lng : 19.0410601533035
        }, 
        {
            lat : 47.4766235853,
            lng : 19.0412157214264
        }, 
        {
            lat : 47.4769571543118,
            lng : 19.0413069165329
        }, 
        {
            lat : 47.4774284982182,
            lng : 19.0414517558197
        }, 
        {
            lat : 47.4777729391682,
            lng : 19.0416609681229
        }, 
        {
            lat : 47.477805570299,
            lng : 19.0418540871719
        }, 
        {
            lat : 47.4777946932577,
            lng : 19.0420150197128
        }
    ],
    zoom : 16
  },
  createdBy: userOneId,
  createdAt: new Date()
};

const clearLocations = () => {
  return Location.remove({})
}

const populateLocations = () => {
  return clearLocations().then(() => new Location(newLocation).save());
}

const activityTypeID = new ObjectID();
const activityType = {
  _id: activityTypeID,
  name: "activity type",
  createdBy: userOneId,
  createdAt: new Date()
};

const clearActivityTypes = () => {
  return ActivityType.remove({})
}

const populateActivityTypes = () => {
  return clearActivityTypes().then(() => new ActivityType(activityType).save());
}

const eventID = new ObjectID();
const eventDate = new Date();
const evt = {
  _id: eventID,
  name: "event",
  date: eventDate,
  location_id: locId,
  attendees: [],
  createdBy: userOneId,
  createdAt: new Date()
};

const clearEvents = () => {
  return Event.remove({})
}

const populateEvents = () => {
  return populateLocations()
    .then(() => 
      clearEvents().then(() => new Event(evt).save())
    )
}

const messageID = new ObjectID();
const message = {
  _id: messageID,
  text: "message",
  recipient_id: userTwoId,
  createdBy: userOneId,
  createdAt: new Date()
};

const clearMessages = () => {
  return Message.remove({})
}

const populateMessages = () => {
  return clearMessages().then(() => new Message(message).save());
}

const activityID = new ObjectID();
const activity = {
  _id: activityID,
  location_id: locId,
  activityType_id: activityTypeID,
  durationInSeconds: 300,
  distanceInMeters: 2000,
  date: new Date(),
  createdBy: userOneId,
  createdAt: new Date()
};

const clearActivities = () => {
  return Activity.remove({})
}

const populateActivities = () => {
  return clearActivities().then(() => new Activity(activity).save());
}

export { 
  populateUsers, token, newUser, anotherUser, anotherToken,
  clearLocations, populateLocations, newLocation,
  clearActivityTypes, populateActivityTypes, activityType,
  clearEvents, populateEvents, evt,
  clearMessages, populateMessages, message,
  clearActivities, populateActivities, activity
};