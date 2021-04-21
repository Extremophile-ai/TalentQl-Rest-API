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
    it('/posts/update_post/:postId should not allow authenticated user to create a post with empty text field', (done) => {
      chai
        .request(server)
        .patch('/posts/add_new_post')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('Please include your text in the text field to continue.');
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
    it('/posts/:postId should get own post', (done) => {
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
    it('/posts/update_post/:postId should not let authenticated user edit another user posts', (done) => {
      chai
        .request(server)
        .patch('/posts/update_post/605f83b5ba78ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .send(post2)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql("you're not allowed to edit this post.");
          done();
        });
    });
    it('/posts/update_post/:postId should instruct authenticated user to add a text field', (done) => {
      chai
        .request(server)
        .patch('/posts/update_post/605f83b5ba78ca5d6b515af8')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('Please include your edit text in the text field to continue.');
          done();
        });
    });
    it('/posts/update_post/:postId should update a logged in Own post', (done) => {
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
        .delete('/posts/delete_post/60382dd567c98f38dc9c8fb4')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('message')
            .eql('post not found.');
          done();
        });
    });
    it("/posts/delete_post/:postId should not let authenticated users delete posts they don't own", (done) => {
      chai
        .request(server)
        .delete('/posts/delete_post/60382dd567c98f39dc9c8fb4')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have
            .property('message')
            .eql("you're not allowed to delete this post.");
          done();
        });
    });
    it('/posts/delete_post/:postId should let logged in users delete their own posts', (done) => {
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
