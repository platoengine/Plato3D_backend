const {spawn} = require('child_process');
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {payload}} = req;

  let exeName = '';
  let exeArgs = [];
  if (payload.hostCode === 'Albany') {
    exeName = 'Albany';
    exeArgs = [payload.inputFileName];
  } else
  if (payload.hostCode === 'Analyze') {
    exeName = 'lgr';
    exeArgs = ['--input-config=' + payload.inputFileName];
  } else {
    console.log('Unknown host code requested: ' + payload.hostCode);
    res.status(200).send('FAILURE');
  }

  let sim = null;
  if (payload.useMPI) {
    const myArgs = ['-np', payload.numProcs, exeName].concat(exeArgs);
    sim = spawn( 'mpirun', myArgs, {cwd: './calculations'});
    console.log('Started simulation');
    res.status(200).send('SUCCESS');
  } else {
    sim = spawn( exeName, exeArgs, {cwd: './calculations'});
    console.log('Started simulation');
    res.status(200).send('SUCCESS');
  }
  sim.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  sim.stderr.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
});

module.exports = router;
