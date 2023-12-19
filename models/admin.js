const mongoose = require ("mongoose");
const utilisateur = require("./utilisateur");

const adminSchema = mongoose.Schema(
    {
    }
)
module.exports = utilisateur.discriminator('Admin', adminSchema);

