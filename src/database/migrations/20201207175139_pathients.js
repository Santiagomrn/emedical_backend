
exports.up = function(knex) {
    return knex.schema.createTable('pathients', t => {
        t.increments('id').unsigned().primary()
        t.string('name',100).notNullable();
        t.string('lastName',100).notNullable();
        t.string('phone',15).notNullable();
        t.string('email',50).unique().notNullable();
        t.string('emergencyPhone',15).notNullable();
        t.string('password',100).notNullable();
        t.date('birthdate').notNullable();
        t.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('pathients')
};
