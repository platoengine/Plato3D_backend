const router = require('express').Router();
const https = require('https');
const readExodusFile = require('../../helpers/readExodusFile');

router.post('/', function(req, res) {
  const urlString = req.body.url;

  const tokens = urlString.split('/');
  const modelName = tokens.pop();
  const userName = req.body.username;

  const get = function(url, resolve, reject) {
    https.get(url, (httpsResponse) => {
      if (httpsResponse.statusCode===301 || httpsResponse.statusCode===302) {
        console.log('following redirection');
        return get(httpsResponse.headers.location, resolve, reject);
      }
      console.log('not redirected');

      const body = [];

      httpsResponse.on('data', (d) => {
        body.push(d);
      });
      httpsResponse.on('end', () => {
        const modelData = Buffer.concat(body);
        return readExodusFile(modelName, modelData, userName);
      });
    });
  };

  const getData = function(url) {
    return new Promise((resolve, reject) => get(url, resolve, reject));
  };

  // call
  getData(urlString).then( () => {
    res.status(200).send('SUCCESS');
  }).catch( () => {
    res.status(200).send('FAILURE');
  });
});

module.exports = router;
