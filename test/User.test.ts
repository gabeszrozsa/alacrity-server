import app from '../src/app';
import User from '../src/models/User';
import * as request from 'supertest';
import { expect } from 'chai';
import * as mocha from 'mocha';

mocha.beforeEach(function(done) {
  this.timeout(0);
  User.remove({}).then(() => done());
});

mocha.describe('POST /api/users/new', function() {
  it('should create a user', function(done) {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      displayName: "Clark Kent",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(200)
      .end((err) => {
        if (err) { return done(err); }
        User.findOne({ email: newUser.email }).then(user => {
          expect(user).to.exist;
          expect(user.password).to.not.equal(newUser.password);
          done();
        })
      });
  });

  it('should return user\'s data with token', function(done) {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      displayName: "Clark Kent",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body.email).to.equal(newUser.email);
        expect(res.body._id).to.exist;
        expect(res.body.token).to.exist;
      })
      .end(done);
  });

  it('should send Bad Request error if request does not have email', (done) => {
    this.timeout(0);
    const newUser = {
      displayName: "Clark Kent",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error if email is invalid', (done) => {
    this.timeout(0);
    const newUser = {
      email: "hello",
      displayName: "Clark Kent",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error if email is in use', (done) => {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      displayName: "Clark Kent",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(200)
      .end(() => {
        request(app)
        .post('/api/users/new')
        .send(newUser)
        .expect(400)
        .end(done);
      });
  });

  it('should send Bad Request error if request does not have displayName', (done) => {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error if displayName does not have a minimum length of 1', (done) => {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      displayName: "",
      password:"password"
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error if request does not have password', (done) => {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      displayName: "Clark Kent",
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error if password does not have a minimum length of 6', (done) => {
    this.timeout(0);
    const newUser = {
      email: "superman@email.com",
      password: "12345",
      displayName: "Clark Kent",
    };

    request(app)
      .post('/api/users/new')
      .send(newUser)
      .expect(400)
      .end(done);
  });
});

mocha.describe('POST /api/users/login', function() {
  const newUser = new User({
    email: "batman@email.com",
    displayName: "Bruce Wayne",
    password:"password"
  });

  mocha.beforeEach(function(done) {
    this.timeout(0);
    request(app)
    .post('/api/users/new')
    .send(newUser)
    .end(done);
  });

  it('should log in user with corrent credentials', function(done) {
    this.timeout(0);
    request(app)
      .post('/api/users/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body._id).to.exist;
        expect(res.body.token).to.exist;
        expect(res.body.email).to.equal(newUser.email);
        expect(res.body.displayName).to.equal(newUser.displayName);
      })
      .end(done);
  });

  it('should send Bad Request error with wrong email', function(done) {
    this.timeout(0);
    request(app)
      .post('/api/users/login')
      .send({ email: '', password: newUser.password })
      .expect(400)
      .end(done);
  });

  it('should send Bad Request error with wrong password', function(done) {
    this.timeout(0);
    request(app)
      .post('/api/users/login')
      .send({ email: newUser.email, password: '' })
      .expect(400)
      .end(done);
  });
});

mocha.describe('GET /api/users/all', function() {
  let token;
  
  const newUser = new User({
    email: "batman@email.com",
    displayName: "Bruce Wayne",
    password:"password"
  });

  mocha.beforeEach(function(done) {
    this.timeout(0);
    request(app)
    .post('/api/users/new')
    .send(newUser)
    .end((err, res) => {
      token = res.headers['x-auth'];
      done();
    });
  });

  it('should return every user', function(done) {
    this.timeout(0);
    request(app)
      .get('/api/users/all')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).to.equal(1);
        expect(res.body[0]._id).to.exist;
        expect(res.body[0].email).to.equal(newUser.email);
        expect(res.body[0].displayName).to.equal(newUser.displayName);
      })
      .end(done);
  });

  it('should send Unauthorized error without auth token', function(done) {
    this.timeout(0);
    request(app)
      .get('/api/users/all')
      .expect(401)
      .end(done);
  });

});

mocha.describe('GET /api/users/current', function() {
  let token;
  
  const newUser = new User({
    email: "batman@email.com",
    displayName: "Bruce Wayne",
    password:"password"
  });

  mocha.beforeEach(function(done) {
    this.timeout(0);
    request(app)
    .post('/api/users/new')
    .send(newUser)
    .end((err, res) => {
      token = res.headers['x-auth'];
      done();
    });
  });

  it('should return current user', function(done) {
    this.timeout(0);
    request(app)
      .get('/api/users/current')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.exist;
        expect(res.body.email).to.equal(newUser.email);
        expect(res.body.displayName).to.equal(newUser.displayName);
      })
      .end(done);
  });

  it('should send Unauthorized error without auth token', function(done) {
    this.timeout(0);
    request(app)
      .get('/api/users/current')
      .expect(401)
      .end(done);
  });

});