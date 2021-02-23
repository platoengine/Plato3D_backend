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
          if (current == latest) {
            //  reads directory content
            const dirCont = fs.readdirSync( runDir );
            let file = '';
            for (const index in dirCont) {
              if (dirCont[index].includes('diagnostics.txt')) {
                file = dirCont[index];
                break;
              }
            }
            const conv = runDir+'/'+file;
            const dat= fs.readFileSync(conv, {encoding: 'utf8'});
            const event2 = 'convergencePlotData';
            const arrayOfLines = dat.match(/[^\r\n]+/g);
            let headerline = arrayOfLines[0].split(' ');
            headerline = headerline.filter((item) => item);
            const indexOfIter = headerline.indexOf('Iter');
            const indexOfFX = headerline.indexOf('F(X)');
            const fx_ = [];
            const iter_ = [];
            const plotData = {};
            for (const index in arrayOfLines) {
              if (index == 0) {
                continue;
              }
              if (index == arrayOfLines.length-1) {
                break;
              }
              let lineArray = arrayOfLines[index].split(' ');
              lineArray = lineArray.filter((item) => item);
              fx_.push(lineArray[indexOfFX]);
              iter_.push(lineArray[indexOfIter]);
            }
            plotData['fx'] = fx_;
            plotData['iter'] = iter_;
            sse.send({
              optimizationName: optimizationName,
              data: plotData}, event2);
          }
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
