const { Model } = require('objection');

class MedicalAppointment extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'medicalAppointments';
  }
  // Each model must have a column (or a set of columns) that uniquely
  // identifies the rows. The column(s) can be specified using the `idColumn`
  // property. `idColumn` returns `id` by default and doesn't need to be
  // specified unless the model's primary key is something else.
  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    const Doctor = require('./doctor');
    const Pathient= require('./pathient');
    return {
      doctor: {
        modelClass: Doctor,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'medicalAppointments.doctorId',
          to: 'doctors.id'
        }
      },
      pathient: {
        modelClass: Pathient,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'medicalAppointments.pathientId',
          to: 'pathients.id'
        }
      }
    }
  }
}

module.exports = MedicalAppointment;