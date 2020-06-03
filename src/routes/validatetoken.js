const router = require('express').Router();
const {JWTSecret} = require('../config/JWTkey');
const jwt = require('jsonwebtoken');
const R = require('ramda');
const no = R.either(R.isEmpty, R.isNil);

router.post('/', function(req, res) {
  if (no(req.body)) {
    res.status(200).send({error: 'no data in the request'});
    return;
  }
  const {body: {token, username}} = req;
  const decodedtoken = jwt.verify(token, JWTSecret);

  if (decodedtoken.username === username) {
    res.status(200).send({Authenticated: true});
  } else {
    console.log('token is not valid');
    res.status(200).send({Authenticated: false});
  }
});

module.exports = router;
