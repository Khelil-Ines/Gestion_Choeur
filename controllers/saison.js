const Candidature = require("../models/candidature");
const Choriste = require("../models/choriste");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");
const Candidat = require("../models/candidat");

const getSaison = async (req, res) => {
  try {
    const saison = req.params.saison;

    const choristes = await Choriste.find({
      date_adhesion: {
        $lte: new Date(`${saison}-12-31T23:59:59.999Z`),
      },
      statut: "Actif",
    });
    const repetitions = await Repetition.find({
      date: {
        $gte: new Date(`${saison}-01-01T00:00:00.000Z`),
        $lte: new Date(`${saison}-12-31T23:59:59.999Z`),
      },
    });

    const concert = await Concert.find({
      date: {
        $gte: new Date(`${saison}-01-01T00:00:00.000Z`),
        $lte: new Date(`${saison}-12-31T23:59:59.999Z`),
      },
    });
    const candidat = await Candidat.find({
      createdAt: {
        $gte: new Date(`${saison}-01-01T00:00:00.000Z`),
        $lte: new Date(`${saison}-12-31T23:59:59.999Z`),
      },
    });
    console.log(candidat);

    res.status(200).json({
      Choristes_de_saison: choristes,
      Répétitions_de_saison: repetitions,
      Concert_de_saison: concert,
      Candidats_de_saison: candidat,
      message: "Données de saison trouvées !",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Une erreur est survenue lors de la récupération des données.",
    });
  }
};

const lancerCandidature = (req, res) => {
  const candidature = new Candidature(req.body);
  candidature
    .save()
    .then(() => {
      res.status(201).json({
        model: candidature,
        message: "candidature lancée!",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

const updateCandidature = (req, res) => {
  Candidature.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((cand) => {
      if (!cand) {
        res.status(404).json({
          message: "Candidature non trouvé!",
        });
      } else {
        res.status(200).json({
          Candidature: cand,
          message: "Candidature modifié!",
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

const candidatureEstOuverte = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature introuvable" });
    }

    const dateActuelle = new Date();
    const dateDebut = candidature.dateDebut;
    const dateFin = candidature.dateFin;
    console.log(dateActuelle);
    console.log(dateDebut);
    console.log(dateActuelle >= dateDebut && dateActuelle <= dateFin);

    if (dateActuelle >= dateDebut && dateActuelle <= dateFin) {
      res.json({ candidatureOuverte: true });
    } else {
      res.json({ candidatureOuverte: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  lancerCandidature,
  getSaison,
  candidatureEstOuverte,
  updateCandidature,
};
