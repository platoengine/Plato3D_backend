const fs = require('fs'); // include file system module
const router = require('express').Router();
const runDir = './calculations';
const getUserTime = require('../../helpers/getUserTime');
const {sse} = require('../../config/serverSentEvent');
const {spawn} = require('child_process');

router.post('/', function(req, res) {
  if (req.files !== null) {
    const exoFileName = `${req.body.username}-${getUserTime()}.exo`;
    const exoFilePath = `${runDir}/${exoFileName}`;
    const modelName = req.files.file.name;
    fs.writeFile(exoFilePath, req.files.file.data, 'utf-8', function(err) {
      if (err) {
        res.status(200).send('FAILURE');
        console.log('Failed to upload exodus model');
      } else {
        console.log('Uploaded exodus model');

        sse.send({
          modelName: modelName,
          remoteName: exoFileName,
          remotePath: `${runDir}/`}, 'modelRemoteData');

        const eventName = 'modelGeometryData';
        const executableName = 'exo2obj';
        const convert = spawn(executableName, [exoFilePath, runDir]);

        convert.stdout.on('data', (data) => {
          strData = `${data}`;
          entries = strData.split('\n').filter( (e) => e !== '' );
          typeArray = entries.map( (e) => e.split(':')[0] );
          dataArray = entries.map( (e) => e.split(':')[1] );
          for (iData=0; iData<entries.length; iData++) {
            const thisIndex = iData;
            fs.readFile( dataArray[iData], 'utf-8', function(err, data) {
              if (err) {
                console.log(`read error: ${err}`);
              }
              sse.send({
                modelName: modelName,
                type: typeArray[thisIndex],
                name: dataArray[thisIndex],
                remoteName: exoFileName,
                remotePath: `${runDir}/`,
                data: data}, eventName);
            });
          }
        });

        convert.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        res.status(200).send('SUCCESS');
      }
    });
  };
});

module.exports = router;
