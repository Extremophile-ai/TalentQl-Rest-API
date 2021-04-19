import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import {
  user,
  userA,
  userB,
  userC,
  user2,
  user2A,
  user2B,
  user2C,
  user2D

} from './user-data';

chai.should();
chai.use(chaiHttp);

describe('Should handle correct user behaviour', async () => {
  describe('/ should render the homepage', () => {
    it('it should render the homepage', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/user/signup should create a user', () => {
    it('should validate user email', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(userA)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should validate user password', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(userB)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should create a user with complete and validated details successfully', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have
            .property('message')
            .eql('New user account created successfully.');
          done();
        });
    });
    it('it should not create a user with an already registered email', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(userC)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
  });

  describe('/user/login should sign in a user', () => {
    it('should validate login email', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user2C)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should validate login password', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(user2D)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should not sign in a user with unregistered email', (done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user2B)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Sorry, email does not exist.');
          done();
        });
    });
    it('it should not sign in a user with wrong password details', (done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user2A)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Sorry, password supplied is incorrect.');
          done();
        });
    });
    it('it should sign in a user with complete details successfully', (done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('logged in successfully.');
          done();
        });
    });
  });
});
