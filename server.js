const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  config = require('./config'); // get our config file

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080,
  apiRoutes = require('./routes/api.js');

// use body parser so we can get info from POST and/or URL parameters

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
