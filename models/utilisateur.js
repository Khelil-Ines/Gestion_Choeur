const mongoose = require ("mongoose")

const UtilisateurSchema = mongoose.Schema(
    {
    
        nom :{type : String , required : true},
        prénom : {type : String, required : true},
        num_tel:{ type :Number, required : false},
        CIN :{type : Number, required : false},
        adresse: {type : String, required : false},
        mail: {type : String, unique: true},
        date_naiss:{ type : Date, required : false},
        sexe : {type : String, enum : ['Homme', 'Femme'] , required: false}

    }
)
module.exports = mongoose.model("Utilisateur", UtilisateurSchema)