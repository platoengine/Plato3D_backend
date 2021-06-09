const router = require('express').Router();

router.post('/', function(req, res) {
  const {body: {payload}} = req;

  const file = `${payload.runDir}/design.stl`;
  res.download(file);
});

module.exports = router;
