const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanningSchema = new Schema({
  candidat: {
    type: mongoose.Types.ObjectId,
    ref: 'Candidat',
    required: true,
  },
  dateAudition: { type: Date, required: true },
  HeureDeb: { type: String, required: true },
  HeureFin: { type: String, required: true },

});

module.exports = mongoose.model("Planning", PlanningSchema);
