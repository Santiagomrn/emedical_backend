
exports.up = function(knex) {
    return knex.schema.createTable('medicalAppointments', t => {
        t.increments('id').unsigned().primary();
        t.integer('doctorId').unsigned().notNullable();
        t.integer('pathientId').unsigned().notNullable();
        t.string('QRCode');
        t.date('date').notNullable();
        t.time('time'); 
        t.integer('turn'); // 8 hours of work there is 16 posibles dates, 30 min by date
        t.timestamps(true,true);

        t.foreign('doctorId').references('id').inTable('doctors');
        t.foreign('pathientId').references('id').inTable('pathients');
        
    }).alterTable('medicalAppointments',t =>{
        t.unique(['date','time','doctorId']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('medicalAppointments')
};
