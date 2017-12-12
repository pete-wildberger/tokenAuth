const router = require('express').Router(),
  pool = require('../db/connection'),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('../config.js'); // get our config file

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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

router.post('/', (req, res) => {
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
          const payload = {
            admin: data.admin
          };
          var token = jwt.sign(payload, config.secret, {
            expiresIn: 600 // expires in 10 minutes
          });

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
