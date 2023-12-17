const mongoose = require ("mongoose");
const utilisateur = require("./utilisateur");

const adminSchema = mongoose.Schema(
    {
        mdp :{type : String}
    }
)
module.exports = utilisateur.discriminator('Admin', adminSchema);

