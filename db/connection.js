const pg = require('pg');

var config = {
  host: 'localhost',
  database: 'tokenauth'
};

var pool = new pg.Pool(config);

module.exports = pool;
