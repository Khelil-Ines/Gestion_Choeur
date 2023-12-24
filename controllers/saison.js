const liste_audition = require("../models/liste_audition");
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

const lancerAudition = (req, res) => {
  const listeAud = new liste_audition(req.body);
  listeAud
    .save()
    .then(() => {
      res.status(201).json({
        model: listeAud,
        message: "audition lancé!",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = { lancerAudition, getSaison };
