// eslint-disable-next-line new-cap
const router = require('express').Router();
const User = require('../models/Users.js'); // user login model
const R = require('ramda');
const jwt = require('jsonwebtoken');
const {JWTSecret} = require('../config/JWTkey');

const no = R.either(R.isNil, R.isEmpty);

router.post('/', function(req, res) {
  const {body: {username, password, email}} = req;
  if (no(req.body)) {
    console.log('your forms are empty!');
    res.status(200).send({error: 'your forms are empty'});
    return;
  };
  const newUser = new User({
    username,
    password,
    email,
  });
  // salt and hash the password
  newUser.password = newUser.generateHash(newUser.password);
  newUser.isUsernameUnique(function(err, result) {
    if (err) {
      console.log('something went wrong');
    } else if (result == 0) {
      newUser.save();
      registrationSuccess = true;
      const newtoken = jwt.sign(
          {username},
          JWTSecret, {expiresIn: '24h'}
      );
      res.status(200).send(JSON.stringify(
          {token: newtoken, Authenticated: true}
      ));
      console.log('You have registered successfully');
    } else {
      res.status(200).send(JSON.stringify({Authenticated: false}));
      console.log('registration failed');
    }
  });
});

module.exports = router;
