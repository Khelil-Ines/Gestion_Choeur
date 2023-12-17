const mongoose = require("mongoose");

const auditionSchema = mongoose.Schema({
  résultat:{type :String, enum: ["En Attente", "Accepté", "Refusé"]},
  date_audition : { type: Date, required: true },
  tessiture :{ type : String, enum: ["Basse", "Alto", "Tenor", "Soprano"]},
    Extrait_chanté : { type : String},
    appréciation :{type : String,  enum: ["A+","A", "A-","B+", "B", "B-","C+", "C", "C-"]},
    remarque : {type : String, default: ""},
    présence : {type:Boolean,default:false},
    candidates: [
        {
          candidateId: { type: Schema.Types.ObjectId, ref: 'Candidat', required: true },
          auditionStartTime: { type: String, required: true },
          auditionDuration: { type: Number, required: true },
        }
      ]
});
module.exports = mongoose.model("Audition", auditionSchema);

 