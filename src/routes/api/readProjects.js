const ProjectDataModel = require('../../models/ProjectData');
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {username}} = req;

  ProjectDataModel.find({userid: username})
      .sort({LastModified: -1})
      .exec(function(err, QueryResults) {
        if (err) {
          console.log(err);
        } else {
          console.log(`readProjects query: ${QueryResults}`);
          res.status(200).send(QueryResults);
        }
      });
});

module.exports = router;
