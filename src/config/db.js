const mongoose = require('mongoose');
const mongoDB = 'mongodb://PlatoDeploy:leg0l0s@ds135747.mlab.com:35747/scene_data';

mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error:'));

module.db = db;
