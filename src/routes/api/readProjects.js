const ScenePrimitivesModel = require('../../models/ScenePrimitives');
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {username}} = req;

  ScenePrimitivesModel.find({userid: username})
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
