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
    });
module.exports = mongoose.model("Audition", auditionSchema);