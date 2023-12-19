const mongoose = require("mongoose");

const auditionSchema = mongoose.Schema({
  résultat:{type :String, enum: ["En Attente", "Accepté", "Refusé"], required: true},
  date_audition : { type: Date, required: false },
  pupitre :{ type : String, enum: ["Basse", "Alto", "Tenor", "Soprano"], required: true},
  Extrait_chanté : { type : String, required: false},
  appréciation :{type : String,  enum: ["A+","A", "A-","B+", "B", "B-","C+", "C", "C-"], required:false},
  remarque : {type : String, default: "", required: false},
  présence : {type:Boolean,default:false },
    candidat: {
      type: mongoose.Types.ObjectId,
      ref: 'Candidat',
      required: true,
    },
  dateAudition: { type: Date, required: false },
  HeureDeb: { type: String, required: false },
  HeureFin: { type: String, required: false },
  
  });
module.exports = mongoose.model("Audition", auditionSchema);