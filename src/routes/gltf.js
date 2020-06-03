const router = require('express').Router();

router.get('/', (req, res) => {
  // eslint-disable-next-line max-len
  const file = '/home/skylerrobbins/Documents/projects/plato3D/Plato3D_Backend/output.gltf';
  res.download(file); // Set disposition and send it.
});


module.exports = router;
