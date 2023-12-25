const Repetition = require("../models/repetition");
const Choriste = require("../models/choriste");
const crypto = require('crypto');
const moment = require("moment");
const axios = require("axios");

const fetchRepetition = (req, res) => {
  Repetition.findOne({ _id: req.params.id })
    .then((repetition) => {
      if (!repetition) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: repetition,
          message: "objet trouvé!",
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


const addRepetition = (req, res) => {
  const newRepetition = new Repetition(req.body);
  newRepetition
    .save()
    .then((repetition) => {
      res.json(repetition);
    })
    .catch((err) => {
      res.status(400).json({ erreur: "Échec de la création du l'repetition" });
    });
};

const getPlanning = (req, res) => {
  Repetition.find()
    .then((repetitions) => {
      res.status(200).json({
        model: repetitions,
        message: "success",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction",
      });
    });
};

const updateRepetition = (req, res) => {
  Repetition.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  }).then((repetition) => {
    if (!repetition) {
      res.status(404).json({
        message: "objet non trouvé!",
      });
    } else {
      res.status(200).json({
        model: repetition,
        message: "objet modifié!",
      });
      axios.get(
        "http://localhost:5000/api/notifrep/changes/" +
          repetition.heureDebut +
          "/" +
          repetition.lieu
      );
    }
  });
};


const deleteRepetition = (req, res) => {
  Repetition.deleteOne({ _id: req.params.id })
    .then((repetitions) =>
      res.status(200).json({
        message: "success!",
      })
    )

    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "probleme d'extraction ",
      });
    });
};



const getPlanningByDate = async (req, res) => {
  try {
    const dateParam = req.body.date;
    // Vérifier le format de la date (JJ-MM-AA)
    const isValidDate = moment(dateParam, "YYYY-MM-DD", true).isValid();
    if (!isValidDate) {
      return res.status(400).json({
        message: "Format de date invalide. Utilisez le format AAAA-MM-JJ.",
      });
    }

    const dateRepetition = new Date(dateParam);

    // Récupérez les répétitions pour la date spécifiée
    const repetitions = await Repetition.find({
      date: {
        $gte: moment(dateRepetition).startOf("day").toDate(),
        $lte: moment(dateRepetition).endOf("day").toDate(),
      },
    });

    res.status(200).json({
      model: repetitions,
      message: `Liste des répétitions pour le ${dateRepetition.toDateString()} récupérée avec succès!`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Problème d'extraction des répétitions pour la date spécifiée",
    });
  }
};

module.exports = {
  addRepetition,
  getPlanning,
  fetchRepetition,
  updateRepetition,
  deleteRepetition,
  getPlanningByDate,
};

