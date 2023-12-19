const mongoose = require ("mongoose")

const UtilisateurSchema = mongoose.Schema(
    {
       
        nom :{type : String},
        prénom : {type : String},
        num_tel:{ type :Number},
        CIN :{type : Number},
        adresse: {type : String},
        mail: {type : String},
        date_naiss:{ type : Date},
        sexe : {type : String, enum : ["Homme", "Femme"]}

    }
)
module.exports = mongoose.model("Utilisateur", utilisateurSchema)