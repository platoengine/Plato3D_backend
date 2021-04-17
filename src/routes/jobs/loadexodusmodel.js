const fs = require('fs');
const router = require('express').Router();
const {sse} = require('../../config/serverSentEvent');
const {spawn} = require('child_process');

router.post('/', function(req, res) {
  const {body: {exoFileName, exoFilePath, modelName}} = req;

  const eventName = 'modelGeometryData';
  const executableName = 'exo2obj';
  const convert =
    spawn(executableName, [`${exoFilePath}/${exoFileName}`, exoFilePath]);

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
        console.log(`read success. sending`);
        sse.send({
          modelName: modelName,
          type: typeArray[thisIndex],
          name: dataArray[thisIndex],
          remoteName: exoFileName,
          remotePath: exoFilePath,
          data: data}, eventName);
      });
    }
  });

  convert.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  res.status(200).send('SUCCESS');
});

module.exports = router;
