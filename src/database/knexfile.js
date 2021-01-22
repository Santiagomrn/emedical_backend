// Update with your config settings.

module.exports = {

  development: {
    client:'mysql',
    connection: {
      host:'bzwztwugjvvkyv66d6dr-mysql.services.clever-cloud.com', 
      database: 'bzwztwugjvvkyv66d6dr',
      user:'uxcvendoceioixmy',
      password: 'tsurskwjN1VCk0M4Qubj'
    },
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client:'mysql',
    connection: {
      host:'bzwztwugjvvkyv66d6dr-mysql.services.clever-cloud.com', 
      database: 'bzwztwugjvvkyv66d6dr',
      user:'uxcvendoceioixmy',
      password: 'tsurskwjN1VCk0M4Qubj'
    },
  }

};
