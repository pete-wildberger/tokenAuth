const router = require('express').Router(),
  pool = require('../db/connection');

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
