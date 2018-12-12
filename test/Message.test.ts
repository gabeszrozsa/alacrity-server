import app from '../src/app';
import { Message } from '../src/models/index';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';
import { populateUsers, token, clearMessages, message, populateMessages, anotherToken } from './seed';

describe('Message', function() {
  beforeEach(populateUsers);

  describe('POST /api/messages', function() {
    
    it('should send a message', function(done) {
      this.timeout(0);
  
      clearMessages().then(() => {
        request(app)
          .post('/api/messages')
          .send(message)
          .set('x-auth', token)
          .expect(200)
          .end((err) => {
            if (err) { return done(err); }
            Message.findOne({ text: "message" }).then(res => {
              expect(res).to.exist;
              expect(res._id).to.exist;
              expect(res.createdBy).to.exist;
              expect(res.createdAt).to.exist;
              expect(res.recipient_id).to.exist;
              expect(res.text).to.equal(message.text);
              done();
            })
          });
      })
  
    });
    
    it('should return my personal messages', function(done) {
      this.timeout(0);
  
      clearMessages().then(() => {
        request(app)
          .post('/api/messages')
          .send(message)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.sent).to.exist;
            expect(res.body.sent.length).to.equal(1);
            expect(res.body.sent[0]._id).to.exist;
            expect(res.body.sent[0].createdBy).to.exist;
            expect(res.body.sent[0].createdAt).to.exist;
            expect(res.body.sent[0].recipient_id).to.exist;
            expect(res.body.sent[0].text).to.equal(message.text);
            expect(res.body.received).to.exist;
            expect(res.body.received.length).to.equal(0);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .post('/api/messages')
        .send(message)
        .expect(401)
        .end(done);
    });
  });
  
  describe('GET /api/messages', function() {
    it('should get my personal messages', function(done) {
      this.timeout(0);
  
      populateMessages().then(() => {
        request(app)
          .get('/api/messages')
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.sent).to.exist;
            expect(res.body.sent.length).to.equal(1);
            expect(res.body.sent[0]._id).to.exist;
            expect(res.body.sent[0].createdBy).to.exist;
            expect(res.body.sent[0].createdAt).to.exist;
            expect(res.body.sent[0].recipient_id).to.exist;
            expect(res.body.sent[0].text).to.equal(message.text);
            expect(res.body.received).to.exist;
            expect(res.body.received.length).to.equal(0);
          })
          .end(done);
      })
  
    });

    it('should get different messages with another token', function(done) {
      this.timeout(0);
  
      populateMessages().then(() => {
        request(app)
          .get('/api/messages')
          .set('x-auth', anotherToken)
          .expect(200)
          .expect(res => {
            expect(res.body.received).to.exist;
            expect(res.body.received.length).to.equal(1);
            expect(res.body.received[0]._id).to.exist;
            expect(res.body.received[0].createdBy).to.exist;
            expect(res.body.received[0].createdAt).to.exist;
            expect(res.body.received[0].recipient_id).to.exist;
            expect(res.body.received[0].text).to.equal(message.text);
            expect(res.body.sent).to.exist;
            expect(res.body.sent.length).to.equal(0);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .get('/api/messages/')
        .expect(401)
        .end(done);
    });
  });
  
  describe('DELETE /api/messages/:id', function() {
    it('should delete a specific message', function(done) {
      this.timeout(0);
  
      populateMessages().then(() => {
        request(app)
          .delete('/api/messages/' + message._id)
          .set('x-auth', token)
          .expect(200)
          .end(done);
      })
  
    });

    it('should get my empty personal messages', function(done) {
      this.timeout(0);
  
      populateMessages().then(() => {
        request(app)
          .delete('/api/messages/' + message._id)
          .set('x-auth', token)
          .expect(200)
          .expect(res => {
            expect(res.body.sent).to.exist;
            expect(res.body.sent.length).to.equal(0);
            expect(res.body.received).to.exist;
            expect(res.body.received.length).to.equal(0);
          })
          .end(done);
      })
  
    });
  
    it('should send Unauthorized error without auth token', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/messages/' + message._id)
        .expect(401)
        .end(done);
    });
  
    it('should send Not found error if ID is not valid', function(done) {
      this.timeout(0);
      request(app)
        .delete('/api/messages/' + 1234)
        .set('x-auth', token)
        .expect(404)
        .end(done);
    });
  });
});
