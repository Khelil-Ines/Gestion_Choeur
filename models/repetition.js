const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({
  date:{type :Date, required:true},
  heureDebut:{type :String, required:true},
  heureFin:{type :String, required:true},
  lieu:{type :String, required:true},
  liste_Presents: { type: Array, required: false },
  liste_Abs: { type: Array, required: false },
  prcPupitre1: { type: Number, required: false },
  prcPupitre2: { type: Number, required: false },
  prcPupitre3: { type: Number, required: false },
  prcPupitre4: { type: Number, required: false },
  link: { type: String, required: true }

});
module.exports = mongoose.model("Repetition", repetitionSchema);