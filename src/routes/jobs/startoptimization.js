const {spawn} = require('child_process');
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {payload}} = req;

  const exeName = './go.sh';
  const exeArgs = [];

  const sim = spawn(exeName, exeArgs, {cwd: payload.runDir});

  sim.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  sim.stderr.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  res.status(200).send('started');
});

module.exports = router;
