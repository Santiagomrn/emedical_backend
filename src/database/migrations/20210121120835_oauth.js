
exports.up = function(knex) {
    return knex.schema.createTable('oauth', t => {
        t.string('token').unique();
        t.integer('clientId').unsigned().notNullable();
        t.integer('rol').unsigned().notNullable();
        t.integer('userId');
        t.integer('expitarion');
        t.timestamp(true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('oauth')
};
