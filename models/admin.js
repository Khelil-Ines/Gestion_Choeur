const mongoose = require("mongoose");
const utilisateur = require("./utilisateur");

const AdminSchema = mongoose.Schema({

});

module.exports = utilisateur.discriminator("Admin", AdminSchema);