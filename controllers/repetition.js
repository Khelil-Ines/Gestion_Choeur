const Repetition = require("../models/repetition");
const Choriste = require("../models/choriste");
const crypto = require("crypto");
const moment = require("moment");
const axios = require("axios");
const cron = require('node-cron');
const Concert = require("../models/concert");


const RepetitionFinie = cron.schedule("01 12 * * *", async (res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const repetitionsToUpdate = await Repetition.find({ date: { $lt: today } });

    if (!repetitionsToUpdate || repetitionsToUpdate.length === 0) {
      console.error("No repetitions found.");
      return res.status(404).json({ error: "Aucune répétition trouvée." });
    }

    // Assuming 'etat' is a field in your Repetition model
    for (const repetition of repetitionsToUpdate) {
      console.log(`Updating repetition ${repetition._id}...`);
      repetition.etat = "Done";
      await repetition.save();
    }

    console.log("Repetitions updated successfully.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des répétitions :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour des répétitions" });
  }
});

RepetitionFinie.start();


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
function generateRandomURL() {
  // Define the characters that can be used in the random URL
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Start the random URL with 'https:'
  let randomURL = "https:";

  // Generate 10 random characters and append them to the URL
  for (let i = 0; i < 10; i++) {
    // Select a random character from the characters string
    randomURL += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // Append the '.com' domain to complete the URL
  randomURL += ".com";

  // Return the generated random URL
  return randomURL;
}

const addRepetition = async (req, res) => {
  try {
    // Utilize the generateRandomURL function for link generation
    const randomLink = generateRandomURL();

    const heureDeb = moment(req.body.heureDebut, "HH:mm");
    const heureFin = moment(req.body.heureFin, "HH:mm");
    const dateRepetition = moment(req.body.date);

    // Check if heureDeb is before heureFin
    if (!heureDeb.isBefore(heureFin)) {
      return res.status(400).json({ error: "Invalid start time or end time." });
    }

    // Check if dateRepetition is equal to or greater than the current date
    if (dateRepetition.isBefore(moment(), "day")) {
      return res.status(400).json({ error: "Invalid repetition date." });
    }

    const newRepetition = new Repetition({
      ...req.body,
      link: randomLink,
    });

    // Save the new repetition
    const repetition = await newRepetition.save();

    // Retrieve all the IDs of choristers (assuming the Choriste model has a field _id)
    const choristes = await Choriste.find({}, "_id");

    // Add the IDs of choristers to the absence list of the new repetition
    repetition.liste_Abs = choristes.map((choriste) => choriste._id);

    // Save the updated repetition again
    await repetition.save();

    res.json(repetition);
  } catch (error) {
    console.error("Error while saving the repetition:", error);
    res.status(400).json({ error: "Failed to create the repetition" });
  }
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
      // axios.get(
      //   "http://localhost:5000/api/notifrep/changes/" +
      //     repetition._id +
      //     "/" +
      //     repetition.heureDebut +
      //     "/" +
      //     repetition.lieu
      // );
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

const repetitionPourcentage = async (req, res) => {
  try {
    const concert = await Concert.findOne({ _id: req.params.id });

    if (!concert) {
      return res.status(404).json({
        success: false,
        message: 'Concert not found.',
      });
    }

    const liste_Absents = concert.liste_Abs;
    console.log(liste_Absents);
    const {
      date,
      heureDebut,
      heureFin,
      lieu,
      prcSoprano,
      prcAlto,
      prcTenor,
      prcBasse,
      link,
      programme,
    } = req.body;

    // Initialisez les compteurs pour chaque pupitre
    let countSoprano = 0;
    let countAlto = 0;
    let countTenor = 0;
    let countBasse = 0;

    // Parcourez la liste des absents et comptez les choristes pour chaque pupitre
    for (const choristeId of liste_Absents) {
      try {
        // Recherchez le choriste dans la base de données
        const choriste = await Choriste.findById(choristeId);
    
        // Vérifiez si le choriste existe et s'il a un pupitre
        if (choriste && choriste.pupitre) {
          // Mettez à jour les compteurs en fonction du pupitre du choriste
          switch (choriste.pupitre) {
            case 'Soprano':
              countSoprano +=1;
              break;
            case 'Alto':
              countAlto+=1
              break;
            case 'Tenor':
              countTenor+=1
              break;
            case 'Basse':
              countBasse+=1
              break;
          }
        }    
      } catch (error) {
        console.error('Erreur lors de la recherche du choriste :', error);
      }
    }
    
    console.log('le nombre de choristes Soprano est : ', countSoprano)
    console.log('le nombre de choristes Alto est : ', countAlto)
    console.log('le nombre de choristes Tenor est : ', countTenor)
    console.log('le nombre de choristes Basse est : ', countBasse)
    const totalPourcentage = countSoprano + countAlto + countTenor + countBasse;
console.log('le total des choristes est : ', totalPourcentage)

    //const totalChoristes = liste_Absents.length; 

    if (
      !Number.isInteger(prcSoprano) ||
      !Number.isInteger(prcAlto) ||
      !Number.isInteger(prcTenor) ||
      !Number.isInteger(prcBasse) ||
      prcSoprano + prcAlto + prcTenor + prcBasse !== 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Les pourcentages des pupitres ne sont pas valides ou ne totalisent pas 100%.",
      });
    }

    const nbChoristesSoprano = Math.round((prcSoprano / 100) * countSoprano);
    console.log('le nombre de choristes Soprano demandé est : ', nbChoristesSoprano)
    const nbChoristesAlto = Math.round((prcAlto / 100) * countAlto);
    console.log('le nombre de choristes Alto demandé est : ', nbChoristesAlto)
    const nbChoristesTenor = Math.round((prcTenor / 100) * countTenor);
    console.log('le nombre de choristes Tenor demandé est : ', nbChoristesTenor)
    const nbChoristesBasse = Math.round((prcBasse / 100) * countBasse);
    console.log('le nombre de choristes Basse demandé est : ', nbChoristesBasse)

    const listeChoristesSoprano = await Choriste.find({ _id: { $in: liste_Absents }, pupitre: 'Soprano' });
    //console.log('la liste Soprano est : ', listeChoristesSoprano);
    const listeChoristesBasse = await Choriste.find({ _id: { $in: liste_Absents }, pupitre: 'Basse'});
    //console.log('la liste Basse est : ', listeChoristesBasse);
    const listeChoristesTenor = await Choriste.find({ _id: { $in: liste_Absents }, pupitre: 'Tenor' });
    //console.log('la liste Tenor est : ', listeChoristesTenor);
    const listeChoristesAlto = await Choriste.find({ _id: { $in: liste_Absents } , pupitre: 'Alto'});

    const listeSoprano = listeChoristesSoprano.slice(0, nbChoristesSoprano);
    //console.log('la liste Soprano est : ', listeSoprano);

    const listeAlto = listeChoristesAlto.slice(0, nbChoristesAlto);
    //console.log('la liste Alto est : ', listeAlto);

    const listeTenor = listeChoristesTenor.slice(0, nbChoristesTenor);
    //console.log('la liste Tenor est : ', listeTenor);

    const listeBasse = listeChoristesBasse.slice(0, nbChoristesBasse);
    //console.log('la liste Basse est : ', listeBasse);

    // Créez un nouvel objet Répétition avec les données
    const nouvelleRepetition = new Repetition({
      date,
      heureDebut,
      heureFin,
      lieu,
      prcSoprano,
      prcAlto,
      prcTenor,
      prcBasse,
      link,
      listeSoprano,
      listeAlto,
      listeTenor,
      listeBasse,
      programme,
    });

    // Enregistrez la nouvelle répétition dans la base de données
    await nouvelleRepetition.save();
    const listeSopranoDetails = await Choriste.find(
      { _id: { $in: listeSoprano } },
      "nom prenom pupitre"
    );
    const listeAltoDetails = await Choriste.find(
      { _id: { $in: listeAlto } },
      "nom prenom pupitre"
    );
    const listeTenorDetails = await Choriste.find(
      { _id: { $in: listeTenor } },
      "nom prenom pupitre"
    );
    const listeBasseDetails = await Choriste.find(
      { _id: { $in: listeBasse } },
      "nom prenom pupitre"
    );

    console.log("La liste des choristes Soprano :", listeSopranoDetails);
    console.log("La liste des choristes Basse :", listeAltoDetails);
    console.log("La liste des choristes Tenor :", listeTenorDetails);
    console.log("La liste des choristes Alto :", listeBasseDetails);

    // Répondez avec succès
    res
      .status(200)
      .json({ success: true, message: "Répétition ajoutée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la répétition :", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de l'ajout de la répétition.",
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
  repetitionPourcentage,
};
