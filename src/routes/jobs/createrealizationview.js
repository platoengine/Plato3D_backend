const fs = require('fs'); // include file system module
const router = require('express').Router();
const runDir = './calculations/';
const {sse} = require('../../config/serverSentEvent');
const {spawn} = require('child_process');

router.post('/', function(req, res) {
  const {body: {viewDefinition}} = req;
  const {viewName, scriptName, realizationName} = viewDefinition;

  const python = '/usr/bin/python';
  const scriptFileName = './scripts/' + scriptName;
  const inFileName = `${runDir}/out_vtk/steps.pvd`;
  const outFileName = `${runDir}/out_vtk/out.ply`;
  const getData = spawn(python, [scriptFileName, inFileName, outFileName]);

  getData.on('close', (data) => {
    let errStatus = 0;
    fs.readFile( outFileName, 'utf-8', function(err, fileData) {
      if (err) {
        console.log(`read error: ${err}`);
        errStatus = 1;
      }
      const eventName = 'realizationViewData';
      sse.send({
        realizationName: realizationName,
        viewName: viewName,
        data: fileData}, eventName);
    });
    if (errStatus == 0) {
      res.status(200).send('SUCCESS');
    } else {
      res.status(200).send('FAILURE');
    }
  });
  getData.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
});

module.exports = router;
