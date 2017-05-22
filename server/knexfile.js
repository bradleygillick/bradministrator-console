module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'angular-expenses-crud',
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }

};