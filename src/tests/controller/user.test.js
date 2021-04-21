import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import {
  user,
  userA,
  userB,
  userC,
  userD,
  user2,
  user2A,
  user2B,
  user2C,
  user2D,
  profile,
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
    it('it should not create a user if data is not suplied', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('Accept', 'application/json')
        .send(userD)
        .end((err, res) => {
          res.should.have.status(400);
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
          res.body.should.have
            .property('message')
            .eql('Sorry, an account is already registered with this email.');
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
  describe('/user/profile/update should handle user profle funcionalities', () => {
    let userToken;
    let expiredToken;
    before((done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user2)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.token;
          done();
        });
    });
    it('should not let user with expired session update profile', (done) => {
      chai
        .request(server)
        .patch('/user/profile/update')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(profile)
        .end((err, res) => {
          res.should.have.status(410);
          res.body.should.have.property('message').eql('Session expired, you have to login.');
          done();
        });
    });
    it('should not let un-authenticated user update profile', (done) => {
      chai
        .request(server)
        .patch('/user/profile/update')
        .send(profile)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it("should update an authenticated user's profile", (done) => {
      chai
        .request(server)
        .patch('/user/profile/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send(profile)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql('Profile update was successful.');
          done();
        });
    });
  });
  describe('user/feeds should handle display of feeds for users', () => {
    let userToken;
    before((done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user2)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.token;
          done();
        });
    });
    it('should not let un-authenticated user view post of other users', (done) => {
      chai
        .request(server)
        .get('/user/post/605f83b5ba67ca5d6b515af8')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it('should not show deleted or non-existent posts to authenticated user', (done) => {
      chai
        .request(server)
        .get('/user/post/605f83b6ba67ca5d6b515af3')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql(true);
          res.body.should.have.property('message').eql('Sorry, this post does not exist or may have been deleted by the author.');
          done();
        });
    });
    it('should show other users posts to other authenticated users', (done) => {
      chai
        .request(server)
        .get('/user/post/605f83b5ba67ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql('post retrieved successfully');
          done();
        });
    });
    it('should not display feeds to un-authenticated users', (done) => {
      chai
        .request(server)
        .get('/user/post/feeds')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it('should display feeds an authenticated user', (done) => {
      chai
        .request(server)
        .get('/user/post/feeds')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message').eql('Feeds retrieved successfully');
          done();
        });
    });
  });
});
