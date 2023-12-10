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
    type: String,
    enum: ['Soprano', 'Alto', 'Tenor','Basse'],
  },
  
  email:{type :String, required:true, unique: true},

  compte: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Compte' ,
        required: false 
  },
  
  
 /* statut: {
    type: String,
    required: true
  },*/
});


module.exports = Choriste = mongoose.model("Choriste", choristeSchema);