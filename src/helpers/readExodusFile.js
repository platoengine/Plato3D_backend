const fs = require('fs'); // include file system module
const getUserTime = require('./getUserTime');
const {sse} = require('../config/serverSentEvent');
const {spawn} = require('child_process');

const runDir = './calculations';

const readExodusFile = function(modelName, modelData, userName) {
  return new Promise(function(resolve, reject) {
    const tokens = modelName.split('.');
    const fileExtension = tokens.pop();

    const baseFileName = `${userName}-${getUserTime()}`;
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

    fs.writeFile(inputFilePath, modelData, 'utf-8', function(err) {
      if (err) {
        reject(Error('file write failed'));
      } else {
        console.log('Uploaded model');

        sse.send({
          modelName: modelName,
          remoteName: exoFileName,
          remotePath: `${runDir}/`}, 'modelRemoteData');

        const convert = spawn(command, {shell: true, cwd: runDir});

        // exo2obj writes the following info:
        // $~> {'block','sideset','nodeset'}:{id}:{path}
        // below parses this info and sends it back
        const eventName = 'modelGeometryData';
        convert.stdout.on('data', (data) => {
          strData = `${data}`;
          entries = strData.split('\n').filter( (e) => e !== '' );
          typeArray = entries.map( (e) => e.split(':')[0] );
          idArray = entries.map( (e) => e.split(':')[1] );
          dataArray = entries.map( (e) => e.split(':')[2] );
          for (iData=0; iData<entries.length; iData++) {
            const thisIndex = iData;
            const thisType = typeArray[thisIndex];
            const thisID = idArray[thisIndex];
            const thisName = dataArray[thisIndex];
            fs.readFile( `${runDir}/${dataArray[thisIndex]}`, 'utf-8',
                function(err, data) {
                  if (err) {
                    console.log(`read error: ${err}`);
                  }
                  sse.send({
                    modelName: modelName,
                    type: thisType,
                    id: thisID,
                    name: thisName,
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

        resolve();
      }
    });
  });
};
module.exports = readExodusFile;
