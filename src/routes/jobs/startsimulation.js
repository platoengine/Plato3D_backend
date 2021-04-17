const {spawn} = require('child_process');
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {payload}} = req;

  let exeName = '';
  let exeArgs = [];

  exeName = 'analyze';
  exeArgs = ['--input-config=analyzeInput.xml'];

  let sim = null;
  if (payload.useMPI) {
    const myArgs = ['-np', payload.numProcs, exeName].concat(exeArgs);
    sim = spawn( 'mpirun', myArgs, {cwd: payload.runDir});
    console.log('Started simulation');
    res.status(200).send('SUCCESS');
  } else {
    sim = spawn( exeName, exeArgs, {cwd: payload.runDir});
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
