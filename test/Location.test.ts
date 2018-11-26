import app from '../src/app';
import { Location } from '../src/models/index';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { populateUsers, token, clearLocations, newLocation, populateLocations } from './seed';

describe('Location', function() {
  beforeEach(populateUsers);

  describe('POST /api/location', function() {
    
    it('should create a location', function(done) {
      this.timeout(0);
  
      clearLocations().then(() => {
        request(app)
          .post('/api/location')
          .send(newLocation)
          .set('x-auth', token)
          .expect(200)
          .end((err) => {
            if (err) { return done(err); }
            Location.findOne({ name: "loc" }).then(loc => {
              expect(loc).to.exist;
              expect(loc._id).to.exist;
              expect(loc.createdBy).to.exist;
              expect(loc.createdAt).to.exist;
              expect(loc.name).to.equal(newLocation.name);
              expect(loc.coordinates).to.deep.equal(newLocation.coordinates);
              done();
            })
          });
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .post('/api/location')
        .send(newLocation)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/location', function() {
    it('should get all locations', function(done) {
      this.timeout(0);
  
      populateLocations().then(() => {
        request(app)
          .get('/api/location')
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0]._id).to.exist;
            expect(res.body[0].createdBy).to.exist;
            expect(res.body[0].createdAt).to.exist;
            expect(res.body[0].name).to.equal(newLocation.name);
            expect(res.body[0].coordinates).to.deep.equal(newLocation.coordinates);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/location/')
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/location/:id', function() {
    it('should get a specific location', function(done) {
      this.timeout(0);
  
      populateLocations().then(() => {
        request(app)
          .get('/api/location/' + newLocation._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(newLocation.name);
            expect(res.body.coordinates).to.deep.equal(newLocation.coordinates);
          })
          .end(done);
      })
  
    });
    
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/location/' + newLocation._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/location/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('DELETE /api/location/:id', function() {
    it('should delete a specific location', function(done) {
      this.timeout(0);
  
      populateLocations().then(() => {
        request(app)
          .delete('/api/location/' + newLocation._id)
          .set('x-auth', token)
          .expect(200)
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/location/' + newLocation._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/location/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
  
  describe('PATCH /api/location/:id', function() {
    const update = { name: 'update' };
  
    it('should update a specific location', function(done) {
      this.timeout(0);
  
      populateLocations().then(() => {
        request(app)
          .patch('/api/location/' + newLocation._id)
          .send(update)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.exist;
            expect(res.body.createdAt).to.exist;
            expect(res.body.createdBy).to.exist;
            expect(res.body.name).to.equal(update.name);
            expect(res.body.coordinates).to.deep.equal(newLocation.coordinates);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/location/' + newLocation._id)
        .send(update)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .patch('/api/location/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
});
