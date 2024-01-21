const mongoose = require ("mongoose")

const ParamSchema = mongoose.Schema(
    {
        
        seuilNomination : {type : Number, default: 3}

    }
)
module.exports = mongoose.model("ParamAbs", ParamSchema)
