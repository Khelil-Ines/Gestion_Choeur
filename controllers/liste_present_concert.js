const Concert = require("../models/concert"); 

const identifierListeFinal = async (req, res) => {
  try {
    const concertId = req.params.id;
    const concertTrouve = await Concert.findById({ _id: concertId });

    if (!concertTrouve) {
      throw new Error("Concert non trouvé");
    }

    const seuilPresence = concertTrouve.seuil_présence;

    const personnesDispo = concertTrouve.liste_Abs;
    console.log("dis"+ personnesDispo);

    const dispoSeuilInferieur = personnesDispo.filter((personne) => {
      return personne.nbr_absences < seuilPresence;
    });

    const compteurPupitreDispo = {
      soprano: 0,
      alto: 0,
      tenor: 0,
      basse: 0,
    };

    dispoSeuilInferieur.forEach((personne) => {
      compteurPupitreDispo[personne.pupitre]++;
    });
    console.log("pup.soprano"+ compteurPupitreDispo);

    return compteurPupitreDispo;
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'identification des absents");
  }
};

module.exports = {
  identifierListeFinal,
};
