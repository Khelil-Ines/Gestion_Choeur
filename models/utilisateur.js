const mongoose = require ("mongoose")

const UtilisateurSchema = mongoose.Schema(
    {      
        nom :{ type : String, required: true },
        prénom :{ type : String, required: true },
        num_tel:{ type: Number},
        CIN :{ type: Number, unique: true},
        adresse: { type : String},
        email: { type: String, unique: true},
        date_naiss: { type: Date},
        sexe : { type: String, enum : ['Homme', 'Femme']}
    }
)
module.exports = mongoose.model("Utilisateur", UtilisateurSchema)