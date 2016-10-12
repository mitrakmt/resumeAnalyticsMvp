const mongoose = require('mongoose');
const dotenv = require('dotenv')
const User = require('./User.js');

dotenv.config();
let dbURL = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS +  '@ds021994.mlab.com:21994/resugenius';
let db = mongoose.connection;
mongoose.connect(dbURL);

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Mongo connection estabished');
});

module.exports = db;
