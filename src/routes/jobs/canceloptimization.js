const fs = require('fs'); // include file system module
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {payload}} = req;

  controlFile = '<Terminate>true</Terminate>';

  // write termination files to the run directory
  fs.writeFile(`${payload.runDir}/plato.control`, controlFile, (err) => {
    if (err) {
      console.log('Failed to write console file.');
    } else {
      console.log('wrote console file.');
    }
  });

  res.status(200).send(payload.runDir);
});

module.exports = router;
