// eslint-disable-next-line new-cap
const router = require('express').Router();

const createOptimization = require('./createoptimization');
const createSimulation = require('./createsimulation');
const createRealizationView = require('./createrealizationview');
const createOptimizationView = require('./createoptimizationview');
const uploadExodusModel = require('./uploadexodusmodel');
const loadExodusModel = require('./loadexodusmodel');
const compute = require('./compute');
const startSimulation = require('./startsimulation');
const startOptimization = require('./startoptimization');
// const exotoply = require('./exotoply');

const checkAuthentication = require('../../middleware/auth');

router.use(checkAuthentication);
router.use('/compute', compute);
router.use('/create-simulation', createSimulation);
router.use('/create-optimization', createOptimization);
router.use('/create-realization-view', createRealizationView);
router.use('/create-optimization-view', createOptimizationView);
router.use('/upload-exodus-model', uploadExodusModel);
router.use('/load-exodus-model', loadExodusModel);
router.use('/start-simulation', startSimulation);
router.use('/start-optimization', startOptimization);

module.exports = router;
