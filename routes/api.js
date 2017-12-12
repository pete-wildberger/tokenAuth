const router = require('express').Router(),
  pool = require('../db/connection'),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('../config.js'); // get our config file

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// verification middleware
router.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

function selectAll() {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return reject(err);
      }

      client.query('SELECT * FROM users', (err, result) => {
        done();
        if (err) {
          reject(err);
        }

        resolve(result.rows[0]);
      });
    });
  });
}

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', (req, res) => {
  let users = selectAll();
  users.then(data => {
    console.log(data);
    res.send(data);
  });
});

module.exports = router;
