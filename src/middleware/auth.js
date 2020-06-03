const {JWTSecret} = require('../config/JWTkey');
const jwt = require('jsonwebtoken');
const R = require('ramda');
const no = R.either(R.isNil, R.isEmpty);

const checkAuthentication = function(req, res, next) {
  if (no(req)) {
    console.log('in auth', req);
    console.log(req.body);
    res.status(200).send({error: 'no data in the request'});
    return;
  }
  const {body: {token, username}} = req;

  jwt.verify(token, JWTSecret, function(err, decodedToken) {
    if (err) {
      console.log(`bad token: ${err}`);
      res.status(401).json({Authenticated: false});
    }
    console.log(decodedToken);
    console.log(req.body);
    // console.log(decodedToken.username);
    console.log(`username is ${username}`);
    console.log(`token username is ${decodedToken.username}`);
    console.log(username === decodedToken.username);
    if (decodedToken.username !== username) {
      console.log('invalid claim');
      res.status(200).json({Authenticated: false});
      return;
    }
    return next();
  });
};

module.exports = checkAuthentication;

