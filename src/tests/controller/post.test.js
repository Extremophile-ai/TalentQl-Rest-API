import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import {
  user2,
  user3,
  post1,
  post2
} from './user-data';

chai.should();
chai.use(chaiHttp);

describe('should handle single user posts functionality', () => {
  describe('User can create posts', () => {
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
    it('should not let un-authenticated user create new post', (done) => {
      chai
        .request(server)
        .patch('/posts/add_new_post')
        .send(post1)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it('/posts/add_new_post should let an authenticated user create new post', (done) => {
      chai
        .request(server)
        .patch('/posts/add_new_post')
        .set('Authorization', `Bearer ${userToken}`)
        .send(post1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('post published.');
          done();
        });
    });
  });
  describe('user can get, edit and delete posts', () => {
    let userToken;
    before((done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(user3)
        .end((err, res) => {
          if (err) throw err;
          userToken = res.body.token;
          done();
        });
    });
    it('/posts/:postId should get a single post', (done) => {
      chai
        .request(server)
        .get('/posts/605f83b5ba67ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('post retrieved.');
          done();
        });
    });
    it('/posts/update_post/:postId should not let un-authenticated users edit post', (done) => {
      chai
        .request(server)
        .patch('/posts/update_post/605f83b5ba67ca5d6b515af8')
        .send(post2)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it("/posts/update_post/:postId should update a logged in user's post", (done) => {
      chai
        .request(server)
        .patch('/posts/update_post/605f83b5ba67ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .send(post2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('post editted successfully.');
          done();
        });
    });
    it('/posts/delete_post/:postId should not let un-authenticated user delete posts', (done) => {
      chai
        .request(server)
        .delete('/posts/delete_post/605f83b5ba67ca5d6b515af8')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Sorry, you have to login.');
          done();
        });
    });
    it('/posts/delete_post/:postId cannot delete non-existent posts', (done) => {
      chai
        .request(server)
        .delete('/posts/delete_post/605f83b5fg67ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('error')
            .eql('post not found.');
          done();
        });
    });
    it('/posts/delete_post/:postId should let logged in users delete their posts', (done) => {
      chai
        .request(server)
        .delete('/posts/delete_post/605f83b5ba67ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('message')
            .eql('post deleted successfully.');
          done();
        });
    });
  });
});
