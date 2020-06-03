const router = require('express').Router();
// unique file name package for model computation temp files
const uniqueFilename = require('unique-filename');
const fs = require('fs'); // include file system module

router.post('/', function(req, res) {
  const {body: {computeData}} = req;
  // for some reason this code only work by
  // storing the JSON.stringify)() function in a variable
  const SceneDataTextFileContents = JSON.stringify(
      computeData,
      null,
      2,
  );
  // write contents of post request to unique filename.
  fs.writeFile(
      uniqueFilename('./tmp'),
      SceneDataTextFileContents,
      function(err) {
        if (err) {
          return 'could not open file: ' + err;
        } else {
          res.status(200).send('response from server goes here');
          console.log(JSON.stringify(req.body, null, 2));
          console.log('Saved Successfully');
        }
      });
});

module.exports = router;
