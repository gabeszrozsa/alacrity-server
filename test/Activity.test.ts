import app from '../src/app';
import { Activity } from '../src/models/index';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { 
  populateUsers, populateLocations, populateActivityTypes, token,
  populateActivities, clearActivities, activity
} from './seed';

describe('Activity', function() {
  beforeEach(populateUsers);
  beforeEach(populateLocations);
  beforeEach(populateActivityTypes);

  describe('POST /api/activity', function() {
    
    it('should create an activity', function(done) {
      this.timeout(0);
  
      clearActivities().then(() => {
        request(app)
          .post('/api/activity')
          .send(activity)
          .set('x-auth', token)
          .expect(200)
          .end((err) => {
            if (err) { return done(err); }
            Activity.findOne({ durationInSeconds: 300 }).then((res) => {
              expect(res).to.exist;
              expect(res._id).to.exist;
              expect(res.activityType_id).to.exist;
              expect(res.location_id).to.exist;
              expect(res.createdBy).to.exist;
              expect(res.createdAt).to.exist;
              expect(res.date).to.exist;
              expect(res.durationInSeconds).to.equal(activity.durationInSeconds);
              expect(res.distanceInMeters).to.equal(activity.distanceInMeters);
              done();
            })
          });
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .post('/api/activity')
        .send(activity)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/activity', function() {
    it('should get all activities', function(done) {
      this.timeout(0);
  
      populateActivities().then(() => {
        request(app)
          .get('/api/activity')
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0]._id).to.exist;
            expect(res.body[0].createdBy).to.exist;
            expect(res.body[0].createdAt).to.exist;
            expect(res.body[0].activityType_id).to.exist;
            expect(res.body[0].location_id).to.exist;
            expect(res.body[0].date).to.exist;
            expect(res.body[0].durationInSeconds).to.equal(activity.durationInSeconds);
            expect(res.body[0].distanceInMeters).to.equal(activity.distanceInMeters);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity/')
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/activity/:id', function() {
    it('should get a specific activity', function(done) {
      this.timeout(0);
  
      populateActivities().then(() => {
        request(app)
          .get('/api/activity/' + activity._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.activityType_id).to.exist;
            expect(res.body.location_id).to.exist;
            expect(res.body.date).to.exist;
            expect(res.body.durationInSeconds).to.equal(activity.durationInSeconds);
            expect(res.body.distanceInMeters).to.equal(activity.distanceInMeters);
          })
          .end(done);
      })
  
    });
    
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity/' + activity._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('DELETE /api/activity/:id', function() {
    it('should delete a specific activity', function(done) {
      this.timeout(0);
  
      populateActivities().then(() => {
        request(app)
          .delete('/api/activity/' + activity._id)
          .set('x-auth', token)
          .expect(200)
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/activity/' + activity._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/activity/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('PATCH /api/activity/:id', function() {
    const update = { durationInSeconds: 450 };
  
    it('should update a specific activity', function(done) {
      this.timeout(0);
  
      populateActivities().then(() => {
        request(app)
          .patch('/api/activity/' + activity._id)
          .send(update)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.durationInSeconds).to.equal(update.durationInSeconds);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/activity/' + activity._id)
        .send(update)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/activity/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
});
