const router = require('express').Router();
const getUserTime = require('../../helpers/getUserTime');
const ProjectDataModel = require('../../models/ProjectData');

router.post('/', function(req, res) {
  const {body: {projectData, projectName, username}} = req;
  console.log(req.body);
  console.log(`saveproject project name: ${projectName}`);
  userTime = getUserTime();
  const UserProject = new ProjectDataModel({
    userid: username,
    projectname: projectName,
    projectdata: projectData,
    LastModified: userTime,
    DateCreated: userTime});
  console.log(UserProject);
  UserProject.isProjectNameUnique(projectName, function(err, result) {
    if (err) {
      console.log('saveProject failed');
      res.status(200).send(JSON.stringify({savestatus: false}));
    } else if (result == 0) {
      UserProject.save();
      res.status(200).send(JSON.stringify({
        savestatus: true,
        newproject: UserProject,
      }));
      console.log(result);
    } else {
      console.log('not unique');
      res.status(200).send(JSON.stringify({
        savestatus: false,
        newproject: UserProject, unique: false,
      }));
    }
  });
});

module.exports = router;
