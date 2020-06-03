const ScenePrimitivesModel = require('../../models/ScenePrimitives');
const router = require('express').Router();
const getUserTime = require('../../helpers/getUserTime');

router.post('/', function(req, res) {
  const {body: {username, sceneData, dateCreated, projectName}} = req;
  const updateduserproject = new ScenePrimitivesModel({
    username,
    projectName,
    sceneData,
    dateCreated,
    LastModified: getUserTime(),
  });
  console.log(updateduserproject);
  updateduserproject.save(function(err, product) {
    if (err) {
      console.log('something went wrong');
      res.status(200).send(JSON.stringify({success: false}));
    } else {
      console.log('project updated');
      res.status(200).send(JSON.stringify({
        success: true,
        newproject: updateduserproject,
      }));
    }
  });
});

module.exports = router;
