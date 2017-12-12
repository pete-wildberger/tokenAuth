const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  config = require('./config'); // get our config file

const port = process.env.PORT || 8080,
  api = require('./routes/api'),
  auth = require('./routes/authenticate');

app.use(morgan('dev'));
app.use('/api', api);
app.use('/auth', auth);

// base url
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
