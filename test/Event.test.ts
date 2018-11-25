import app from '../src/app';
import { Event } from '../src/models/index';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { populateUsers, token, clearEvents, evt, populateEvents } from './seed';

describe('Event', function() {
  beforeEach(populateUsers);

  describe('POST /api/event', function() {
    
    it('should create an event', function(done) {
      this.timeout(0);
  
      clearEvents().then(() => {
        request(app)
          .post('/api/event')
          .send(evt)
          .set('x-auth', token)
          .expect(200)
          .end((err) => {
            if (err) { return done(err); }
            Event.findOne({ name: "event" }).then(res => {
              expect(res).to.exist;
              expect(res._id).to.exist;
              expect(res.createdBy).to.exist;
              expect(res.createdAt).to.exist;
              expect(res.name).to.equal(evt.name);
              done();
            })
          });
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .post('/api/event')
        .send(evt)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/event', function() {
    it('should get all events', function(done) {
      this.timeout(0);
  
      populateEvents().then(() => {
        request(app)
          .get('/api/event')
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0]._id).to.exist;
            expect(res.body[0].createdBy).to.exist;
            expect(res.body[0].createdAt).to.exist;
            expect(res.body[0].name).to.equal(evt.name);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/event/' + evt._id)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/event/:id', function() {
    it('should get a specific event', function(done) {
      this.timeout(0);
  
      populateEvents().then(() => {
        request(app)
          .get('/api/event/' + evt._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(evt.name);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/event/')
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/event/:id', function() {
    it('should get a specific event', function(done) {
      this.timeout(0);
  
      populateEvents().then(() => {
        request(app)
          .get('/api/event/' + evt._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(evt.name);
          })
          .end(done);
      })
  
    });
    
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/event/' + evt._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/event/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('DELETE /api/event/:id', function() {
    it('should delete a specific event', function(done) {
      this.timeout(0);
  
      populateEvents().then(() => {
        request(app)
          .delete('/api/event/' + evt._id)
          .set('x-auth', token)
          .expect(200)
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/event/' + evt._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/event/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('PATCH /api/event/:id', function() {
    const update = { name: 'update' };
  
    it('should update a specific event', function(done) {
      this.timeout(0);
  
      populateEvents().then(() => {
        request(app)
          .patch('/api/event/' + evt._id)
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
        .patch('/api/event/' + evt._id)
        .send(update)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/event/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
});
