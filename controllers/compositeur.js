const Compositeur = require("../models/Compositeur");

const addCompositeur = (req, res) => {
  const comp = new Compositeur(req.body);
  console.log(comp);
  comp
    .save()
    .then(() => {
      res.status(201).json({
        model: comp,
        message: "Compositeur ajouté!",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const getAllCompositeur = (req, res) => {
  Compositeur.find()
    .then((auths) =>
      res.status(200).json({
        Livres: auths,
        message: "success!",
      })
    )

    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "probleme d'extraction des livres ! ",
      });
    });
};

module.exports = {
  getAllCompositeur,
  addCompositeur,
};
