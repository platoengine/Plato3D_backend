const router = require('express').Router();
const {db} = require('../../config/db');

router.post('/', function(req, res) {
  const {body: {projectId}} = req;
  console.log(projectId);
  const myquery = {'_id': objectId(projectId)};
  db.collection('sceneprimitivesmodules')
      .deleteOne(myquery, function(err, obj) {
        if (err) {
          res.status(200).send({success: false});
          console.log('something went wrong');
        } else {
          console.log('1 document deleted');
          res.status(200).send({success: true});
        }
      });
});

module.exports = router;
