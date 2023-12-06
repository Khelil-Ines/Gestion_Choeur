const Conge = require("../models/conge");

const addConge = (req, res) => { 
    const newConge = new Conge(req.body);
    newConge.save()
        .then(conge => {
            res.json(conge);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de l\'ajout du congé' });
        });
  }

  module.exports = {
    addConge
  }

