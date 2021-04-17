const fs = require('fs'); // include file system module
const uniqueFilename = require('unique-filename');
const router = require('express').Router();
const shell = require('shelljs');

router.post('/', function(req, res) {
  const {body: {inputFileString, remoteAssets = []}} = req;
  const directoryName = uniqueFilename('');
  const runDir = `./calculations/${directoryName}`;
  shell.mkdir(runDir);

  fs.writeFile(`${runDir}/analyzeInput.xml`, inputFileString, function(err) {
    if (err) {
      res.status(200).send('FAILURE');
      console.log('Failed to create simulation');
    } else {
      res.status(200).send(runDir);
      remoteAssets.forEach((asset) => {
        const pwd = shell.pwd();
        const target = `${pwd}/${asset.remotePath}/${asset.remoteName}`;
        const dest = `${pwd}/${runDir}/${asset.fileName}`;
        shell.ln('-sf', target, dest);
      });
      console.log('Created simulation');
    }
  });
});

module.exports = router;
