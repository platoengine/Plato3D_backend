// eslint-disable-next-line new-cap
const router = require('express').Router();

const createSimulation = require('./createsimulation');
const createRealizationView = require('./createrealizationview');
const uploadExodusModel = require('./uploadexodusmodel');
const compute = require('./compute');
const startSimulation = require('./startsimulation');
// const exotoply = require('./exotoply');

const checkAuthentication = require('../../middleware/auth');

router.use(checkAuthentication);
router.use('/compute', compute);
router.use('/create-simulation', createSimulation);
router.use('/create-realization-view', createRealizationView);
router.use('/upload-exodus-model', uploadExodusModel);
router.use('/start-simulation', startSimulation);

module.exports = router;
