const { Model } = require('objection');

class Doctor extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'doctors';
  }
  // Each model must have a column (or a set of columns) that uniquely
  // identifies the rows. The column(s) can be specified using the `idColumn`
  // property. `idColumn` returns `id` by default and doesn't need to be
  // specified unless the model's primary key is something else.
  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    const MedicalAppointment = require('./medicalAppointment');
    return {
      medicalAppointments: {
        modelClass: MedicalAppointment,
        relation: Model.HasManyRelation,
        join: {
          from: 'doctors.id',
          to: 'medicalAppointments.doctorId'
        }
      }
    }
  }

}
module.exports = Doctor;