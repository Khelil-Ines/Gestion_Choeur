const Choriste = require("../models/choriste");
const Conge = require("../models/conge");
const cron = require("node-cron");

const addConge = async (req, res) => {
  try {
    const choristeId = req.params.id;
    const { date_debut, date_fin } = req.body;

    // Vérifiez si le choriste existe
    const choriste = await Choriste.findById(choristeId);
    if (!choriste) {
      return res.status(404).json({ message: "Choriste non trouvé." });
    }

    // Créez un nouveau congé
    const newConge = new Conge({ date_debut, date_fin });

    // Enregistrez le congé dans la base de données
    const savedConge = await newConge.save();

    // Ajoutez l'ID du congé au tableau des congés du choriste
    choriste.conges.push(savedConge._id);
    choriste.status = "En_Congés";
    choriste.historiqueStatut.push({
      statut: choriste.statut,
      date: date_debut,
    });
    // Enregistre la mise à jour du choriste dans la base de données
    await choriste.save();

    res.status(201).json({ choriste, conge: savedConge });
  } catch (error) {
    console.error("Erreur lors de l'ajout du congé :", error);
    res.status(500).json({ error: "Échec de la création du congé." });
  }
};

const finCongeStatut = cron.schedule("* * * * * ", async () => {
  try {
    // Récupérer tous les choristes à partir de la base de données
    const choristes = await Choriste.find();

    // Mettre à jour le statut pour chaque choriste
    for (const choriste of choristes) {
      const lastConge = choriste.conges[choriste.conges.length - 1];
      if (lastConge) {
        const lastCongeId = lastConge._id;
        console.log("ID of the last congé:", lastCongeId);
        const conge = await Conge.findById(lastCongeId);
        if (!conge) {
          console.log("No congé found for the choriste.");
          return res.status(404).json({ message: "Congé non trouvé." });
        }
        // Vérifiez si la date de fin est égale à la date actuelle
        if (conge.date_fin.getTime() === new Date().getTime()) {
          choriste.status = "Actif";
          choriste.historiqueStatut.push({
            statut: choriste.statut,
            date: conge.date_fin,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error during automatic process", error);
    res.status(500).json({ error: "Error during automatic process" });
  }
});
finCongeStatut.start();

module.exports = {
  addConge,
};
