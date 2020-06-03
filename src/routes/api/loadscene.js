/**
 * @description - takes the username from the request body
 * and uses it in a DB query to load their most recent scene.
 */
// eslint-disable-next-line new-cap
const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {username}} = req;
  console.log('load received');
  ScenePrimitivesModel.find(username)
      .sort({LastModified: -1})
      .limit(1).exec(function(err, QueryResult) {
        if (err) return handleError(err);
        res.send(QueryResult[0]['SceneHashmap']);
        console.log(QueryResult[0]['SceneHashmap']);
      });
});

module.exports = router;
