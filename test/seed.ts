import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { User, Location } from '../src/models/index';

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

const populateUsers = function(done) {
  this.timeout(0);
  User.remove({})
    .then(() => { new User(newUser).save() })
      .then(() => { done() })
      .catch(error => console.log('populateUsers -> save', error))
    .catch(error => console.log('populateUsers -> remove', error))
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

export { 
  populateUsers, token, newUser,
  clearLocations, populateLocations, newLocation,
};