const router = require('express').Router();
const getUserTime = require('../../helpers/getUserTime');
const ScenePrimitivesModel = require('../../models/ScenePrimitives');

router.post('/', function(req, res) {
  const {body: {sceneData, projectName, username}} = req;
  console.log(req.body);
  console.log(`savescene project name: ${projectName}`);
  userTime = getUserTime();
  const UserScene = new ScenePrimitivesModel({
    userid: username,
    projectname: projectName,
    SceneHashmap: sceneData,
    LastModified: userTime,
    DateCreated: userTime});
  console.log(UserScene);
  UserScene.isProjectNameUnique(projectName, function(err, result) {
    if (err) {
      console.log('something went wrong');
      res.status(200).send(JSON.stringify({savestatus: false}));
    } else if (result == 0) {
      UserScene.save();
      res.status(200).send(JSON.stringify({
        savestatus: true,
        newproject: UserScene,
      }));
      console.log(result);
    } else {
      console.log('not unique');
      res.status(200).send(JSON.stringify({
        savestatus: false,
        newproject: UserScene, unique: false,
      }));
    }
  });
});

module.exports = router;
