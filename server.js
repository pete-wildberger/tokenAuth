const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('./config'); // get our config file

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080,
  apiRoutes = require('./routes/api.js');

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use('/api', apiRoutes);
// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
