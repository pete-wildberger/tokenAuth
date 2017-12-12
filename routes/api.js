const router = require('express').Router(),
  pool = require('../db/connection'),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('../config.js'); // get our config file

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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

function findByName(name) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return reject(err);
      }

      client.query('SELECT * FROM users WHERE name=$1', [name], (err, result) => {
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

router.post('/authenticate', (req, res) => {
  console.log('authenticate');
  let users = findByName(req.body.name);
  users.then(
    data => {
      if (data != undefined) {
        console.log('auth', data);
        if (data.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          console.log('match');
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          const payload = {
            admin: data.admin
          };
          var token = jwt.sign(payload, config.secret, {
            expiresIn: 600 // expires in 24 hours
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      } else {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
    },
    err => {
      console.log('err');
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
  );
});

module.exports = router;
