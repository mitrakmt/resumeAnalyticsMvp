const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router.js');
const rootRouter = require('./router.js');
const db = require('./db');
const app = express();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(session({
  secret: 'dis dat mvp yo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Create file to store job industry, and create for optimal keywords

app.use('/', express.static(__dirname + '/client'));

app.use('/api', rootRouter);

app.listen(port);

console.log(`Listening on port ${port}`);
