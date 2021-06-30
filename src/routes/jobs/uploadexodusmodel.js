const router = require('express').Router();
const readExodusFile = require('../../helpers/readExodusFile');

router.post('/', function(req, res) {
  if (req.files !== null) {
    const modelName = req.files.file.name;
    const modelData = req.files.file.data;
    const userName = req.body.username;

    readExodusFile(modelName, modelData, userName).then( () => {
      res.status(200).send('SUCCESS');
    }).catch( () => {
      res.status(200).send('FAILURE');
    });
  };
});

module.exports = router;
