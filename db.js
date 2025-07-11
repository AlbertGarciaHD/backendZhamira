const { Pool } = require("pg");

const pool = new Pool({
  user: 'bd_zhamira_user',
  host: 'd1oiv07diees73cij9hg-a.internal',
  database: 'bd_zhamira',
  password: '0esTpEmP6XrPiFBZQ2lRjVwZEYR78Vmn',
  port: '5432',
  ssl: {
    rejectUnauthorized: false,
  }
});
//d1oiv07diees73cij9hg-a.oregon-postgres.render.com
module.exports = pool;