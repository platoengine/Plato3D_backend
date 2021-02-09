const fs = require('fs'); // include file system module
const router = require('express').Router();
const runDir = './calculations';
const getUserTime = require('../../helpers/getUserTime');
const {sse} = require('../../config/serverSentEvent');
const {spawn} = require('child_process');

router.post('/', function(req, res) {
  if (req.files !== null) {
    const modelName = req.files.file.name;
    const tokens = modelName.split('.');
    const fileExtension = tokens.pop();

    const baseFileName = `${req.body.username}-${getUserTime()}`;
    const baseFilePath = `${runDir}/${baseFileName}`;

    const exoFileName = `${baseFileName}.exo`;
    const csmFileName = `${baseFileName}.csm`;

    let inputFilePath = '';
    let command = '';
    if (fileExtension === 'csm' || fileExtension === 'CSM') {
      inputFilePath = `${baseFilePath}.csm`;
      let csm2exoCommand = `plato-cli geometry esp `;
      csm2exoCommand += `--input ${csmFileName} `;
      csm2exoCommand += `--output-mesh ${exoFileName} `;
      csm2exoCommand += `>/dev/null 2>&1`;

      const exo2objCommand = `exo2obj ${exoFileName} ./`;
      command = csm2exoCommand + ' && ' + exo2objCommand;
    } else {
      command = `exo2obj ${exoFileName} ./`;
      inputFilePath = `${baseFilePath}.exo`;
    }

    console.log(`command: ${command}`);

    fs.writeFile(inputFilePath, req.files.file.data, 'utf-8', function(err) {
      if (err) {
        res.status(200).send('FAILURE');
        console.log('Failed to upload model');
      } else {
        console.log('Uploaded model');

        sse.send({
          modelName: modelName,
          remoteName: exoFileName,
          remotePath: `${runDir}/`}, 'modelRemoteData');

        const convert = spawn(command, {shell: true, cwd: runDir});

        const eventName = 'modelGeometryData';
        convert.stdout.on('data', (data) => {
          strData = `${data}`;
          entries = strData.split('\n').filter( (e) => e !== '' );
          typeArray = entries.map( (e) => e.split(':')[0] );
          dataArray = entries.map( (e) => e.split(':')[1] );
          for (iData=0; iData<entries.length; iData++) {
            const thisIndex = iData;
            fs.readFile( `${runDir}/${dataArray[iData]}`, 'utf-8',
                function(err, data) {
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
                },
            );
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
