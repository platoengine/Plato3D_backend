/* eslint-disable new-cap */
const router = require('express').Router();
const loadscene = require('./loadscene');
const savescene = require('./savescene');
const readProjects = require('./readProjects');
const updateProject = require('./updateProject');
const deleteProject = require('./deleteProject');

const checkAuthentication = require('../../middleware/auth');

router.use(checkAuthentication);

router.use('/loadscene', loadscene);
router.use('/savescene', savescene);
router.use('/getprojects', readProjects);
router.use('/updateproject', updateProject);
router.use('/deleteproject', deleteProject);

module.exports = router;
