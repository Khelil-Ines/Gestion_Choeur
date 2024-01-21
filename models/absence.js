const mongoose = require ("mongoose")

const absenceSchema = mongoose.Schema(
    {
        Type :{type : String, enum : ['Repetition' , 'Concert'], required: true},
        raison : {type : String, Default : 'Aucune raison !'},
        Date : {type : Date, required: true},
        seuilNomination : {type : Number, default: 3}

    }
)
module.exports = mongoose.model("Absence", absenceSchema)

