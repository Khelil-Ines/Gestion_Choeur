const mongoose = require ("mongoose");
const utilisateur = require("./utilisateur");
const historiqueStatutSchema = mongoose.Schema({
    statut: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const choristeSchema = mongoose.Schema(
    {
        tessiture :{type : String, enum: ['Soprano','Alto','Basse','Tenor'], required: true},
        statut :{type : String, enum: ['Actif','En_Congé','Eliminé', 'Nominé'], default: 'Actif'},
        niveau : {type : String, enum : ['Junior','Choriste', 'Sénior', 'Vétéran'], default: 'Junior'}, 
        date_adhesion:{type: Date},
        historiqueStatut: [historiqueStatutSchema],
        nbr_concerts : {type: Number},
        nbr_repetitions : {type: Number},
        nbr_absences : {type: Number, default: 0},
        absences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Absence' }],
    }
)
module.exports = utilisateur.discriminator('Choriste', choristeSchema);

