const mongoose = require('mongoose');
const utilisateur = require('./utilisateur.js');
const historiqueStatutSchema = mongoose.Schema({
    statut: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const chef_pupitreSchema = new mongoose.Schema({
  
    pupitre :{type : String, enum: ['Soprano','Alto','Basse','Tenor'], required: true},
    statut :{type : String, enum: ['Actif','En_Congé','Eliminé', 'Nominé'], default: 'Actif'},
    niveau : {type : String, enum : ['Junior','Choriste', 'Sénior', 'Vétéran'], default: 'Junior'}, 
    date_adhesion:{type: Date},
    historiqueStatut: [historiqueStatutSchema],
    nbr_concerts : {type: Number},
    nbr_repetitions : {type: Number},
   
});

const chef_pupitre = utilisateur.discriminator('Chef_Pupitre', chef_pupitreSchema);

module.exports = chef_pupitre;
