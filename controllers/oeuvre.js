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
    .populate("Compositeur")
    .then((oeu) =>
      res.status(200).json({
        Ouevres: oeu,
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

const getOeuvreById = (req, res) => {
  Oeuvre.findOne({ _id: req.params.id })
    .then((oeuvre) => {
      if (!oeuvre) {
        res.status(404).json({
          message: "oeuvre non trouvé!",
        });
      } else {
        res.status(200).json({
          oeuvre: oeuvre,
          message: "oeuvre trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const getOeuvreByTitle = (req, res) => {
  Oeuvre.findOne({ title: req.params.titre })
    .then((oeuvre) => {
      if (!oeuvre) {
        res.status(404).json({
          message: "oeuvre non trouvé!",
        });
      } else {
        res.status(200).json({
          oeuvre: oeuvre,
          message: "oeuvre trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const getOeuvresByParams = (req, res) => {
  const { title, compositeur, annee } = req.query;
  const searchParams = {};

  if (title) {
    searchParams.title = title;
  }

  if (compositeur) {
    searchParams.compositeurs = compositeur;
  }

  if (annee) {
    searchParams.anneeComposition = annee;
  }

  Oeuvre.find(searchParams)
    .populate("Compositeur")
    .then((oeuvres) => {
      if (oeuvres.length === 0) {
        return res.status(404).json({
          message: "Aucune oeuvre trouvée ",
        });
      }
      res.status(200).json({
        oeuvres: oeuvres,
        message: "oeuvres trouvées avec succès.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Erreur de la recherche d'oeuvres.",
      });
    });
};

const updateOeuvre = (req, res) => {
  Oeuvre.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((oeuvre) => {
      if (!oeuvre) {
        res.status(404).json({
          message: "oeuvre non trouvé!",
        });
      } else {
        res.status(200).json({
          oeuvre: oeuvre,
          message: "oeuvre modifié!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = {
  getAllOeuvres,
  addOeuvre,
  getOeuvreById,
  getOeuvreByTitle,
  getOeuvresByParams,
  updateOeuvre,
};

