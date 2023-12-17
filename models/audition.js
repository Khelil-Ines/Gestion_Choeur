const mongoose = require("mongoose");

const auditionSchema = mongoose.Schema({
    résultat: {
        type: String,
        enum: ["En Attente", "Accepté", "Refusé"],
      },
      candidat: {
        type: mongoose.Types.ObjectId,
        ref: 'Candidat',
        required: true,
      },
      pupitre: {
        type: String,
        enum: ['Soprano', 'Alto', 'Tenor','Basse'],
      },
    });
module.exports = mongoose.model("Audition", auditionSchema);