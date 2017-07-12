require("dotenv").load();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'bradmin',
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }
};