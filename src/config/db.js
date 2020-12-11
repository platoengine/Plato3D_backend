const mongoose = require('mongoose');
// use this line for remote mongodb
// const mongoDB = 'mongodb://PlatoDeploy:leg0l0s@ds135747.mlab.com:35747/scene_data';

// username: develop
// password: Term!nat3d
// mongodb+srv://develop:Term!nat3d@cluster0.dycrh.mongodb.net/cluster0-shard-00-02.dycrh.mongodb.net:27017

// use this line for local mongodb w/ container
// const mongoDB = 'mongodb://mongo:27017/mongo-test';
const mongoDB = 'mongodb+srv://develop:Term!nat3d@cluster0.dycrh.mongodb.net';

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error:'));

module.db = db;
