const mongoose = require('mongoose');
// use this line for remote mongodb
// const mongoDB = 'mongodb://PlatoDeploy:leg0l0s@ds135747.mlab.com:35747/scene_data';

// use this line for local mongodb w/ container
const mongoDB = 'mongodb://mongo:27017/mongo-test';

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error:'));

module.db = db;
