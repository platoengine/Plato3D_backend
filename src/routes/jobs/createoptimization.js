const fs = require('fs'); // include file system module
const uniqueFilename = require('unique-filename');
const router = require('express').Router();
const shell = require('shelljs');

router.post('/', function(req, res) {
  const {body: {files, remoteAssets = []}} = req;

  // create run directory
  const directoryName = uniqueFilename('');
  const pwd = shell.pwd();
  const runDir = `./calculations/${directoryName}`;
  shell.mkdir(runDir);

  // write input files to the run directory
  const tLocalErrors = [];
  Object.keys(files).forEach((key) => {
    fs.writeFile(`${runDir}/${key}`, files[key], (err) => {
      if (err) {
        tLocalErrors.push(`Error writing file: ${key}. Error: err`);
        console.log('Failed to write file: ' + key);
        console.log(err);
      } else {
        console.log('wrote file: ' + key);
      }
    });
  });

  if (tLocalErrors.length !== 0) {
    res.status(200).send('creation FAILED');
    console.log('Creating optimization failed');
    return;
  }

  // create link(s) to the mesh file(s)
  remoteAssets.forEach((asset) => {
    const target = `${pwd}/${asset.remotePath}/${asset.remoteName}`;
    const dest = `${pwd}/${runDir}/${asset.fileName}`;
    shell.ln('-sf', target, dest);
  });

  // write go.sh
  let goScript = '#!/bin/bash \n';
  goScript += 'source mpirun.source';
  const goScriptFileName = `${runDir}/go.sh`;
  fs.writeFile(goScriptFileName, goScript, (err) => {
    if (err) {
      console.log('Failed to write file: go.sh');
      console.log(err);
    } else {
      console.log('wrote file: go.sh');
      shell.chmod('u+x', goScriptFileName);
    }
  });

  // create an empty file, last_time_step.txt, that will be fs.watch'ed for
  // tracking iteration output
  shell.touch(`${runDir}/last_time_step.txt`);

  res.status(200).send(runDir);
});

module.exports = router;
