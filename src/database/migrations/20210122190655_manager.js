
exports.up = function(knex) {
    return knex.schema.createTable('manager', t => {
        t.string('email').notNullable();
        t.string('password').notNullable();
        t.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('manager')
};
