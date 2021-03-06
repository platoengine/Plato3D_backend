// eslint-disable-next-line new-cap
const router = require('express').Router();

const createOptimization = require('./createoptimization');
const cancelOptimization = require('./canceloptimization');
const createSimulation = require('./createsimulation');
const createRealizationView = require('./createrealizationview');
const createOptimizationView = require('./createoptimizationview');
const getOptimizationFile = require('./getoptimizationfile');
const uploadExodusModel = require('./uploadexodusmodel');
const fetchExodusModel = require('./fetchexodusmodel');
const fetchXmlFile = require('./fetchxmlfile');
const loadExodusModel = require('./loadexodusmodel');
const compute = require('./compute');
const startSimulation = require('./startsimulation');
const startOptimization = require('./startoptimization');
// const exotoply = require('./exotoply');

const checkAuthentication = require('../../middleware/auth');

router.use(checkAuthentication);
router.use('/compute', compute);
router.use('/create-simulation', createSimulation);
router.use('/cancel-optimization', cancelOptimization);
router.use('/create-optimization', createOptimization);
router.use('/create-realization-view', createRealizationView);
router.use('/create-optimization-view', createOptimizationView);
router.use('/get-optimization-file', getOptimizationFile);
router.use('/upload-exodus-model', uploadExodusModel);
router.use('/fetch-exodus-model', fetchExodusModel);
router.use('/fetch-xml-file', fetchXmlFile);
router.use('/load-exodus-model', loadExodusModel);
router.use('/start-simulation', startSimulation);
router.use('/start-optimization', startOptimization);

module.exports = router;
