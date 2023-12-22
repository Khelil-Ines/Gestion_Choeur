const mongoose = require("mongoose");

const auditionSchema = mongoose.Schema({
  résultat:{type :String, enum: ["En Attente", "Accepté", "Refusé"]},
  pupitre :{ type : String, enum: ["Basse", "Alto", "Tenor", "Soprano"]},
    Extrait_chanté : { type : String},
    appréciation :{type : String,  enum: ["A+","A", "A-","B+", "B", "B-","C+", "C", "C-"]},
    remarque : {type : String, default: ""},
    présence : {type:Boolean,default:false},
    candidat: {
      type: mongoose.Types.ObjectId,
      ref: 'Candidat',
      required: true,
    },
    dateAudition: { type: Date, required: true },
    HeureDeb: { type: String, required: true },
    HeureFin: { type: String, required: true },
  
  });

module.exports = mongoose.model("Audition", auditionSchema);

