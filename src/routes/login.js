const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/Users.js'); // user login model
const {JWTSecret} = require('../config/JWTkey');
const R = require('ramda');

const no = R.either(R.isEmpty, R.isNil);

router.post('/', function(req, res) {
  if (no(req.body)) {
    res.status(200).send({error: 'no data in the request'});
    return;
  }
  const {body: {username, password}} = req;
  // get login data that the user entered into our forms
  const userLoginCredentials = new User({
    username,
    password,
  });
  // check database for users credential
  User.find({username: userLoginCredentials.username}, function(err, userdata) {
    if (userdata == '') {
      console.log('no user found');
      res.status(200).send({invaliduser: true});
      return;
    } else {
      // create a user instance for the data that is currently
      // stored in the database
      console.log(`userdata: ${userdata}`);
      const storedUserData = new User({username: userdata[0].username,
        password: userdata[0].password,
        email: userdata[0].email,
      });
      console.log(storedUserData);
      // compare the credentials the user typed in with what is in the database.
      // this API is created in Models/Users.js
      storedUserData.verifyPassword(
          userLoginCredentials.password,
          function(err, isMatch) {
            if (err) {
              console.log(isMatch);
              console.log(err);
              res.status(404).send(JSON.stringify({Authentication: false}));
              console.log('there is an error');
            } else if (isMatch) {
              const newtoken = jwt.sign(
                  {username},
                  JWTSecret, {expiresIn: '24h'},
              );
              res.status(200).send(
                  {token: newtoken, Authenticated: true},
              );
              console.log('User login successful');
            } else {
              console.log('invalid password');
              res.status(200).send(JSON.stringify({Authenticated: false}));
            }
          });
    }
  });
});

module.exports = router;
