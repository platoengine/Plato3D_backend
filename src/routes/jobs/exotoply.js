const router = require('express').Router();
const fs = require('fs'); // include file system module
const {spawn} = require('child_process');
// eslint-disable-next-line max-len
const extractIsoPath = '/home/skylerrobbins/Documents/projects/plato3D/Plato3D_Backend/scripts/extractIso.py';
const {sse} = require('../../config/serverSentEvent');
const eventName = 'exodata';

router.post('/', function(req, res) {
  const fileName = 'myTestFile1';
  const destinationFile = `./plys/${fileName}.ply`;
  const sourceFile = './exos/platomain.exo';
  const convert = spawn(
      'pvbatch',
      ['--use-offscreen-rendering',
        extractIsoPath, sourceFile, destinationFile],
  );

  convert.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  convert.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  convert.stderr.on('close', (close) => {
    console.log('inside close');
    console.log(`stdout: ${close}`);
    fs.readFile(
        // eslint-disable-next-line max-len
        `/home/skylerrobbins/Documents/projects/plato3D/Plato3D_Backend/plys/${fileName}0.ply`,
        function(err, data) {
          if (err) {
            console.log(`read error: ${err}`);
            res.status(200).send({data: 'it dont work'});
            return;
          }
          console.log(`read succes`);
          sse.send(data, eventName);
          res.status(200).send({data: data});
        });
  });
});

module.exports = router;
