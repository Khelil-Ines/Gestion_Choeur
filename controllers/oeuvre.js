const Oeuvre = require("../models/oeuvre");

const addOeuvre = (req, res) => {
  const oeuv = new Oeuvre(req.body);
  oeuv
    .save()
    .then(() => {
      res.status(201).json({
        model: oeuv,
        message: "Oeuvre ajouté!",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const getAllOeuvres = (req, res) => {
  Oeuvre.find()
    .then((oeu) =>
      res.status(200).json({
        Livres: oeu,
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
  getAllOeuvres,
  addOeuvre,
};
