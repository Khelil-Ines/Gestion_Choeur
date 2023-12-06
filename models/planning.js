const mongoose = require("mongoose");

const planningSchema = mongoose.Schema({
  date_debut:{type :Date, required:true},
  date_fin:{type :Date, required:true},
  repetition: {
    type: mongoose.Types.ObjectId,
    ref: 'Repetition',
    required: true,
  },
});
module.exports = mongoose.model("Planning", planningSchema);