const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const choristeSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  pupitre: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Pupitre'
  },
});


module.exports = Choriste = mongoose.model("Choriste", choristeSchema);