const Concert = require("../models/concert");
const Choriste = require("../models/choriste");
const Repetition = require("../models/repetition");
const Programme = require("../models/programme");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const identifierListeFinal = async (req, res) => {
  try {
    const concertId = req.params.id;
    const concertTrouve = await Concert.findById(concertId);

    if (!concertTrouve) {
      return res.status(404).json({ message: "Concert non trouvé" });
    }

    const seuilPresence = concertTrouve.seuil_présence;
    const personnesDispo = concertTrouve.liste_dispo;

    let dispoSeuilInferieur = [];
    for (let choristeId of personnesDispo) {
      let choriste = await Choriste.findById(choristeId);
      if (choriste && choriste.nbr_absences < seuilPresence) {
        dispoSeuilInferieur.push(choriste);
      }
    }

    dispoSeuilInferieur.sort((a, b) => {
      return a.nbr_absences - b.nbr_absences;
    });

    for (let choriste of dispoSeuilInferieur) {
      const choristeIdString = choriste._id.toString();
      if (concertTrouve.liste_Abs.indexOf(choristeIdString) === -1) {
        concertTrouve.liste_Abs.push(choristeIdString);
        const index = concertTrouve.liste_dispo.indexOf(choristeIdString);
        if (index !== -1) {
          concertTrouve.liste_dispo.splice(index, 1);
        }
      }
    }

    await concertTrouve.save();

    res.status(200).json({
      message: "Liste des choristes disponibles mise à jour",
      ListeChoristes: concertTrouve.liste_Abs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de l'identification des absents",
      message: error.message,
    });
  }
};

const getPresentParPupitre = async (req, res) => {
  try {
    const pupitre = req.params.pupitre;
    const concert = req.params.concert;
    const concertCorrespondant = await Concert.findOne({ _id: concert });

    if (!concertCorrespondant) {
      return res.status(404).json({ message: "Ce concert n'existe pas" });
    } else {
      const personnesPresentes = [];

      for (const idChoriste of concertCorrespondant.liste_Abs) {
        const pers = await Choriste.findById(idChoriste);
        if (pers && pers.pupitre === pupitre) {
          personnesPresentes.push(pers);
        }
      }

      res.status(200).json({
        message: `Personnes présentes pour le pupitre ${pupitre}`,
        personnes: personnesPresentes,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

const modifierParamPresence = (req, res) => {
  Concert.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((seuil) => {
      if (!seuil) {
        res.status(404).json({
          message: "Concert non trouvé!",
        });
      } else {
        res.status(200).json({
          NouveauSeuil: seuil,
          message: "Concert modifié!",
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

const listPresentRepetitonMemePupitre = async (req, res) => {
  try {
    // const connecte = await Choriste.findOne({
    //   _id: "65a6ad02d53b04e1f1442e19",
    // });
    console.log(req.auth.compteId);
    const connecte = await Choriste.findOne({ compte: req.auth.compteId });

    const repetitionId = req.params.repetition;
    const repetition = await Repetition.findById(repetitionId);

    if (!repetition) {
      console.log("Repetition n'existe pas");
      return res.status(404).json({
        message: "Repetition not found",
      });
    } else {
      const liste = [];

      for (const choristeId of repetition.liste_Presents) {
        const choriste = await Choriste.findById(choristeId);

        if (choriste && choriste.pupitre === connecte.pupitre) {
          liste.push(choriste);
        }
      }

      res.status(200).json({
        message: "Choristes présents",
        choristes_present: liste,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const listAbsentRepetitonMemePupitre = async (req, res) => {
  try {
    const connecte = await Choriste.findOne({ compte: req.auth.compteId });

    const repetitionId = req.params.repetition;
    const repetition = await Repetition.findById(repetitionId);

    if (!repetition) {
      console.log("Repetition n'existe pas");
      return res.status(404).json({
        message: "Repetition not found",
      });
    } else {
      const liste = [];

      for (const choristeId of repetition.liste_Abs) {
        const choriste = await Choriste.findById(choristeId);

        if (choriste && choriste.pupitre === connecte.pupitre) {
          liste.push(choriste);
        }
      }

      res.status(200).json({
        message: "Choristes présents",
        choristes_absent: liste,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const listPresentProgrammeMemePupitre = async (req, res) => {
  try {
    const connecte = await Choriste.findOne({ compte: req.auth.compteId });

    const programmeId = req.params.programme;
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      console.log("programme n'existe pas");
      return res.status(404).json({
        message: "programme not found",
      });
    } else {
      const listeRep = [];
      const répetitions = await Repetition.find();
      for (const repetition of répetitions) {
        if (repetition.programme.includes(programmeId)) {
          listeRep.push(repetition);
        }
      }

      const list = [];
      for (const repetition of listeRep) {
        for (const choristeId of repetition.liste_Presents) {
          const choriste = await Choriste.findById(choristeId);

          if (choriste && choriste.pupitre === connecte.pupitre) {
            list.push(choriste);
          }
        }
      }
      res.status(200).json({
        message:
          "Choriste present pour tous les repetetions qui ont ce programme",
        presence_programme: list,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const listAbsentProgrammeMemePupitre = async (req, res) => {
  try {
    const connecte = await Choriste.findOne({ compte: req.auth.compteId });

    const programmeId = req.params.programme;
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      console.log("programme n'existe pas");
      return res.status(404).json({
        message: "programme not found",
      });
    } else {
      const listeRep = [];
      const répetitions = await Repetition.find();
      for (const repetition of répetitions) {
        if (repetition.programme.includes(programmeId)) {
          listeRep.push(repetition);
        }
      }

      const list = [];
      for (const repetition of listeRep) {
        for (const choristeId of repetition.liste_Abs) {
          const choriste = await Choriste.findById(choristeId);

          if (choriste && choriste.pupitre === connecte.pupitre) {
            list.push(choriste);
          }
        }
      }
      res.status(200).json({
        message:
          "Choriste absent pour tous les repetetions qui ont ce programme",
        presence_programme: list,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  identifierListeFinal,
  getPresentParPupitre,
  modifierParamPresence,
  listPresentRepetitonMemePupitre,
  listAbsentRepetitonMemePupitre,
  listPresentProgrammeMemePupitre,
  listAbsentProgrammeMemePupitre,
};
