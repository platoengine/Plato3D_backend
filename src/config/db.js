const mongoose = require('mongoose');

// use this line for local mongodb w/ container
// const mongoDB = 'mongodb://mongo:27017/mongo-test';
const mongoDB = 'mongodb://localhost:27017/mongo-test';

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error:'));

module.db = db;
