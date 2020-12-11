const fs = require('fs'); // include file system module
const router = require('express').Router();
const _ = require('underscore');
const {sse} = require('../../config/serverSentEvent');
const {spawn} = require('child_process');
const shell = require('shelljs');

router.post('/', function(req, res) {
  const {body: {viewDefinition}} = req;
  const {runDir, optimizationName} = viewDefinition;

  const python = '/usr/bin/python';
  const scriptFileName = './scripts/stlToPLY.py';

  const triggerFile = `${runDir}/last_time_step.txt`;

  let current = 1;

  fs.watch(triggerFile, (eventName, filename) => {
    // read latest from triggerFile
    const latestString
      = fs.readFileSync(triggerFile, {encoding: 'utf8'}).trim();

    const nDigits = latestString.length;

    const latest = parseInt(latestString);

    // for each new step, i.e., latest - current
    const increment = 1; // hard-wired for now
    _.range(current, latest, increment).forEach((iteration) => {
      // copy numbered result stl file to 'design.stl'
      // (paraview gets confused with numbered files)
      const fromName
        = `${runDir}/design${iteration.toString().padStart(nDigits, '0')}.stl`;
      const toName = `${runDir}/design.stl`;
      shell.cp(fromName, toName);

      // convert 'design.stl' to 'design_iterationNumber.ply' and create sse
      const inFileName = toName;
      const outFileName
        = `${runDir}/design${iteration.toString().padStart(nDigits, '0')}.ply`;
      const getData = spawn(python, [scriptFileName, inFileName, outFileName]);

      getData.on('close', (data) => {
        fs.readFile( outFileName, 'utf-8', function(err, fileData) {
          if (err) {
            console.log(`read error: ${err}`);
          }
          const eventName = 'optimizationIterationData';
          sse.send({
            optimizationName: optimizationName,
            iteration: iteration,
            data: fileData}, eventName);
        });
      });
      getData.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });
    });
    current = latest;
  });
  res.status(200).send('SUCCESS');
});

module.exports = router;
