require("dotenv").load();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'angular-expenses-crud',
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }

};