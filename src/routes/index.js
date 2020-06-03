/* eslint-disable new-cap */
const router = require('express').Router();
const api = require('./api');
const login = require('./login');
const jobs = require('./jobs');
const register = require('./register');
const validatetoken = require('./validatetoken');
// const sendevent = require('./sendevent');
const exotoply = require('./jobs/exotoply');
const gltf = require('./gltf');

router.use('/validatetoken', validatetoken);
router.use('/exotoply', exotoply);
router.use('/api', api);
router.use('/jobs', jobs);
router.use('/login', login);
router.use('/register', register);
router.use('/gltf', gltf);
// router.use('/sendevent', sendevent);

module.exports = router;
