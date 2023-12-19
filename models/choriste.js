const mongoose = require('mongoose');
const utilisateur = require("./utilisateur")
// const historiqueStatutSchema = mongoose.Schema({
//     statut: { type: String, required: true },
//     date: { type: Date, default: Date.now }
// });
const choristeSchema = mongoose.Schema(
    {
        pupitre :{type : String, enum: ['Soprano','Alto','Basse','Tenor'], required: true},
        statut :{type : String, enum: ['Actif','En_Congé','Eliminé'], default: 'Actif' },
        niveau : {type : String, enum : ['Junior','Choriste', 'Sénior', 'Vétéran'], default: 'Junior'}, 
        date_adhesion:{type: Date, default: Date.now},
       // historiqueStatut: [historiqueStatutSchema],
        nbr_concerts : {type: Number, default: 0},
        nbr_repetitions : {type: Number, default: 0},
        compte: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Compte' },
        conges: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Conge',
          required: false,
        }],
      });

module.exports = utilisateur.discriminator("Choriste", choristeSchema)
