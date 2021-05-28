// const {spawn} = require('child_process');
const router = require('express').Router();
// const {sse} = require('../../config/serverSentEvent');
// var fs = require('fs');

// router.post('/', function(req, res) {
//  //const {body: {payload}} = req;
//  const filename = 'design.png'
//  const filepath = `./calculations/${filename}`
//
//  const eventName = 'exportSTL'
// //  fs.readFile( filepath, 'utf-8', function(err, data) {
//  fs.readFile( filepath, 'utf-8', function(err, data) {
//    if (err) {
//      console.log(`read error: ${err}`);
//    }
//    console.log(`read success. sending`);
//    sse.send({
//      fileName: filename,
//      data: data}, eventName);
//  })
// });

router.post('/', function(req, res) {
  // const {body: {payload}} = req;

  // const file = `${payload.runDir}/design.stl`;
  // const file = `./calculations/design.png`
  const file = `./calculations/test.pdf`;
  console.log(file);
  res.download(file);
});

// var path = require('path');
// var mime = require('mime');
// var fs = require('fs');

// router.post('/', function(req, res){
//
//  //var file = __dirname + '/upload-folder/dramaticpenguin.MOV';
//  const file = `./calculations/design.png`
//
//  var filename = path.basename(file);
//  var mimetype = mime.lookup(file);
//
//  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//  res.setHeader('Content-type', mimetype);
//
//  var filestream = fs.createReadStream(file);
//  filestream.pipe(res);
// });

module.exports = router;
