const app = require('../../app');
const request = require('supertest');

describe('/login endpoint testing', () => {
  afterAll(async () => {
    await app.close();
  });
  it('should return ok', () => {
    const req = {
      username: 'testuser',
      password: 'testpassword',
    };
    request(app)
        .post('/login')
        .send(req.username, req.password)
        .expect(function(res) {
          expect(res.body.invaliduser).toBe(true);
        })
        .expect(200)
        .end();
  });
  it('should return with error when no body', () => {
    const nullUser = {};
    request(app)
        .post('/login')
        .send(nullUser)
        .expect(200, {error: 'no data in the request'})
        .end();
  });
});

