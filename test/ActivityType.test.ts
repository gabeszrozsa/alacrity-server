import app from '../src/app';
import { ActivityType } from '../src/models/index';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { populateUsers, token, clearActivityTypes, activityType, populateActivityTypes } from './seed';

describe('Activity Type', function() {
  beforeEach(populateUsers);

  describe('POST /api/activity-type', function() {
    
    it('should create an activity type', function(done) {
      this.timeout(0);
  
      clearActivityTypes().then(() => {
        request(app)
          .post('/api/activity-type')
          .send(activityType)
          .set('x-auth', token)
          .expect(200)
          .end((err) => {
            if (err) { return done(err); }
            ActivityType.findOne({ name: "activity type" }).then(res => {
              expect(res).to.exist;
              expect(res._id).to.exist;
              expect(res.createdBy).to.exist;
              expect(res.createdAt).to.exist;
              expect(res.name).to.equal(activityType.name);
              done();
            })
          });
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .post('/api/activity-type')
        .send(activityType)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/activity-type', function() {
    it('should get all activity types', function(done) {
      this.timeout(0);
  
      populateActivityTypes().then(() => {
        request(app)
          .get('/api/activity-type')
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0]._id).to.exist;
            expect(res.body[0].createdBy).to.exist;
            expect(res.body[0].createdAt).to.exist;
            expect(res.body[0].name).to.equal(activityType.name);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity-type/' + activityType._id)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/activity-type/:id', function() {
    it('should get a specific activity type', function(done) {
      this.timeout(0);
  
      populateActivityTypes().then(() => {
        request(app)
          .get('/api/activity-type/' + activityType._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(activityType.name);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity-type/')
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/activity-type/:id', function() {
    it('should get a specific activity type', function(done) {
      this.timeout(0);
  
      populateActivityTypes().then(() => {
        request(app)
          .get('/api/activity-type/' + activityType._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(activityType.name);
          })
          .end(done);
      })
  
    });
    
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity-type/' + activityType._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/activity-type/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('DELETE /api/activity-type/:id', function() {
    it('should delete a specific activity type', function(done) {
      this.timeout(0);
  
      populateActivityTypes().then(() => {
        request(app)
          .delete('/api/activity-type/' + activityType._id)
          .set('x-auth', token)
          .expect(200)
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/activity-type/' + activityType._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/activity-type/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('PATCH /api/activity-type/:id', function() {
    const update = { name: 'update' };
  
    it('should update a specific activity type', function(done) {
      this.timeout(0);
  
      populateActivityTypes().then(() => {
        request(app)
          .patch('/api/activity-type/' + activityType._id)
          .send(update)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(update.name);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/activity-type/' + activityType._id)
        .send(update)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/activity-type/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
});
