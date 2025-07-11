const { Pool } = require("pg");

const pool = new Pool({
  user: "bd_zhamira_user",
  host: "dpg-d1oiv07diees73cij9hg-a.oregon-postgres.render.com", // <-- Aquí lo completo
  database: "bd_zhamira",
  password: "0esTpEmP6XrPiFBZQ2lRjVwZEYR78Vmn",
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;


// git add .
// git commit -m "fix: conexión a la base de datos"
// git push origin main

//postgresql://bd_zhamira_user:0esTpEmP6XrPiFBZQ2lRjVwZEYR78Vmn@dpg-d1oiv07diees73cij9hg-a/bd_zhamira
