require('../../config/db');
const ProjectDataModel = require('../../models/ProjectData');
const router = require('express').Router();


router.post('/', function(req, res) {
  const {body: {projectName, username}} = req;

  console.log(`userid: ${username}`);
  console.log(`projectname: ${projectName}`);
  ProjectDataModel.deleteOne({userid: username, projectname: projectName})
      .then(function() {
        console.log('1 document deleted');
        res.status(200).send({success: true});
      }).catch(function() {
        console.log('deleting document failed');
        res.status(200).send({success: true});
      });
});

module.exports = router;
