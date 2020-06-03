/* eslint-disable require-jsdoc */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();

const {sse} = require('./src/config/serverSentEvent');
app.use(cors());

// for parsing JSON data
app.use(bodyParser.json({limit: '50mb'}));
// required for parsing HTTP body
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(fileUpload());

app.use(require('./src/routes'));


app.get('/stream', sse.init);

app.get('/', (req, res) => {
  res.send('<h1><marquee direction=right>Hello World!</marquee></h1>');
  res.end();
});

// specify which port to listen to
app.listen(3000, function() {
  console.log('Plato is listening on port 3000!');
});

module.exports = app;
