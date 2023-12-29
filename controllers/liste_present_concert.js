const Concert = require("../models/concert");
const Choriste = require("../models/choriste");

const identifierListeFinal = async (req, res) => {
  try {
    const concertId = req.params.id;
    const concertTrouve = await Concert.findById(concertId);
    console.log(concertTrouve);

    if (!concertTrouve) {
      throw new Error("Concert non trouvé");
    }
    const seuilPresence = concertTrouve.seuil_présence;
    const personnesDispo = concertTrouve.liste_Abs;

    let dispoSeuilInferieur = [];
    for (let choristeId of personnesDispo) {
      let choriste = await Choriste.findById(choristeId);
      if (choriste.nbr_absences < seuilPresence) {
        dispoSeuilInferieur.push(choriste);
      }
    }

    dispoSeuilInferieur.sort((a, b) => {
      return a.nbr_absences - b.nbr_absences;
    });

    for (let choristeId of dispoSeuilInferieur) {
      if (concertTrouve.liste_final.indexOf(choristeId._id.toString()) === -1) {
        concertTrouve.liste_final.push(choristeId._id.toString());
        let index = concertTrouve.liste_Abs.indexOf(choristeId._id.toString());
        concertTrouve.liste_Abs.splice(index, 1);
      }
    }
    await concertTrouve.save();

    res.status(200).json({
      message: "Liste des choristes disponibles",
      ListeChoristes: dispoSeuilInferieur,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'identification des absents");
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

      for (const idChoriste of concertCorrespondant.liste_final) {
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

module.exports = {
  identifierListeFinal,
  getPresentParPupitre,
  modifierParamPresence,
};
