const mongoose = require ("mongoose")
const historiqueStatutSchema = mongoose.Schema({
    statut: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const choristeSchema = mongoose.Schema(
    {
        tessiture :{type : String},
        mdp:{type : String},
        statut :{type : String, enum: ['Actif','En_Congé','Eliminé']},
        niveau : {type : String, enum : ['Junior','Choriste', 'Sénior', 'Vétéran']},
        date_adhésion:{type: Date},
        historiqueStatut: [historiqueStatutSchema],
        nbr_concerts : {type: Number},
        nbr_repetitions : {type: Number}

    }
)
module.exports = mongoose.model("Choriste", choristeSchema)


