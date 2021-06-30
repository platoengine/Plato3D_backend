const router = require('express').Router();
const https = require('https');

router.post('/', function(req, res) {
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
        resolve(modelData);
      });
    });
  };

  const getData = function(url) {
    return new Promise((resolve, reject) => get(url, resolve, reject));
  };

  // call
  getData(req.body.url).then( (data) => {
    res.status(200).send(data);
  }).catch( () => {
    res.status(200).send('FAILURE');
  });
});

module.exports = router;
