/* eslint-disable new-cap */
const router = require('express').Router();
// const loadscene = require('./loadscene');
const readProjects = require('./readProjects');
const saveProject = require('./saveProject');
const updateProject = require('./updateProject');
const deleteProject = require('./deleteProject');

const checkAuthentication = require('../../middleware/auth');

router.use(checkAuthentication);

// router.use('/loadscene', loadscene);
router.use('/getprojects', readProjects);
router.use('/saveproject', saveProject);
router.use('/updateproject', updateProject);
router.use('/deleteproject', deleteProject);

module.exports = router;
