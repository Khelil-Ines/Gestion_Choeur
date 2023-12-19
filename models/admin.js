<<<<<<< HEAD
const mongoose = require("mongoose");
const utilisateur = require("./utilisateur");

const AdminSchema = mongoose.Schema({

});

module.exports = utilisateur.discriminator("Admin", AdminSchema);
=======
const mongoose = require ("mongoose");
const utilisateur = require("./utilisateur");

const adminSchema = mongoose.Schema(
    {
    }
)
module.exports = utilisateur.discriminator('Admin', adminSchema);

>>>>>>> Statut_choriste
