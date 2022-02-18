const {spawn} = require('child_process');
const router = require('express').Router();
const {sse} = require('../../config/serverSentEvent');
const fs = require('fs');


router.post('/', function(req, res) {
  const {body: {payload}} = req;

  const exeName = './go.sh';
  const exeArgs = [];

  // remove 'plato.control' file if it exists
  const controlFile = `${payload.runDir}/plato.control`;

  fs.stat(controlFile, function(err, stats) {
    console.log(stats);

    if (err) {
      return console.error(err);
    }

    fs.unlink(controlFile, function(err) {
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });
  });

  const sim = spawn(exeName, exeArgs, {cwd: payload.runDir});

  sim.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  sim.stderr.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  sim.on('exit', function(code) {
    // send exit notification
    sse.send({'name': payload.name, 'code': code}, 'optimizationExited');

    // send final objective results
    const terminalLogFile = `${payload.runDir}/terminal.log`;
    fs.readFile( terminalLogFile, 'utf-8', function(err, fileData) {
      if (err) {
        console.log(`failed to read console. Error: ${err}`);
      }
      const eventName = 'resultsData';
      sse.send({'name': payload.name, 'data': fileData}, eventName);
    });
  });

  res.status(200).send('started');
});

module.exports = router;
