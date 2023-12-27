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
    console.log(seuilPresence);

    let choristesTries = [];

    for (let choristeId of personnesDispo) {
      let choriste = await Choriste.findById(choristeId);
      choristesTries.push(choriste); 
    }

    choristesTries.sort((a, b) => a.nbr_absences - b.nbr_absences);

    let dispoSeuilInferieur = [];
    for (let choristeId of personnesDispo) {
      let choriste = await Choriste.findById(choristeId);
      console.log("**************** choriste " + choriste.nbr_absences);
      if (choriste.nbr_absences < seuilPresence) {
        dispoSeuilInferieur.push(choristeId);
        concertTrouve.liste_final.push(choristeId);
      }
    }
    await concertTrouve.save();

    const compteurPupitreDispo = {
      Soprano: [],
      Alto: [],
      Tenor: [],
      Basse: [],
    };

    await Promise.all(
      dispoSeuilInferieur.map(async (personne) => {
        let pers = await Choriste.findById(personne);
        console.log("**************************pupitre " + pers);
        compteurPupitreDispo[pers.pupitre] = pers;
        concertTrouve.participant_par_pupitre[pers.pupitre].push(pers);
      })
    );

    res.status(200).json({
      message: "Liste des choristes disponibles",
      ListeChoristes: dispoSeuilInferieur,
      personne_par_pupitre: compteurPupitreDispo,
    });

    console.log(compteurPupitreDispo);
    return compteurPupitreDispo;
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

module.exports = {
  identifierListeFinal,
  getPresentParPupitre,
};
