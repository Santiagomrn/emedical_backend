

exports.up = function(knex) {
    return knex.schema.createTable('doctors', t => {
        t.increments('id').unsigned().primary();
        t.string('name',100).notNullable();
        t.string('lastName',100).notNullable();
        t.string('phone',15).unique().notNullable();
        t.string('email',50).unique().notNullable();
        t.string('emergencyPhone',15).notNullable();
        t.string('password').notNullable();
        t.date('birthdate').notNullable();
        t.enu('medicalArea',['médico general','dentista','pediatra','nutriólogo','cardiólogo','médico obsteta','otorrinolaringólogo','médico de diagnóstico']).notNullable();
        t.text('description');
        t.string('jobTitle').notNullable();
        t.string('professionalLicense').notNullable();
        t.string('nationality').notNullable();
        t.enu('maritalStatus',["casado","soltero","divorciado","viudo"]);
        t.string('imageProfilePath');
        t.timestamps(true,true);
    })

};


exports.down = function(knex) {
    return knex.schema.dropTable('doctors')
};
