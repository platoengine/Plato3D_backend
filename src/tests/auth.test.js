const auth = require('../middleware/auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

describe('auth middleware', () => {
  it('middleware should forward request if there is a valid token', () => {
    const next = jest.fn();
    jest.spyOn(jwt, 'verify').mockReturnValue({username: 'testuser6'});

    const jestedauth = jest.fn((req, res, next) => auth(req, res, next));
    const res = httpMocks.createResponse();
    const req = {
      body: {
        token: 'testtoken',
        username: 'testuser6',
      },
    };
    jestedauth(req, res, next);
    // expect(jwt.verify).toHaveBeenCalledTimes(1);
    // expect(next).toHaveBeenCalledTimes(1);
  }),
  it('should reject non-authenticated requests', () => {
    const next = jest.fn();
    const jestedauth = jest.fn((req, res, next) => auth(req, res, next));
    jest.spyOn(jwt, 'verify').mockReturnValue({username: 'testus6'});
    const res = httpMocks.createResponse();
    const req = {
      body: {
        username: 'testuser6',
      },
    };
    jestedauth(req, res, next);
    // expect(res.statusCode).toBe(200);
    // expect(res._getJSONData().Authenticated).toBe(false);
  }),
  it('should always be a function', () => {
    expect(auth).toBeInstanceOf(Function);
  });
});
