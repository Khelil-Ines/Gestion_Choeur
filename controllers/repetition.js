const Repetition = require("../models/repetition");
const Choriste = require("../models/choriste");
const crypto = require('crypto');
const moment = require("moment");
const axios = require("axios");
const cron = require('node-cron');


const RepetitionFinie = cron.schedule('01 12 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const repetitionsToUpdate = await Repetition.find({ date: { $lt: today } });

    if (!repetitionsToUpdate || repetitionsToUpdate.length === 0) {
      console.error('No repetitions found.');
      return res.status(404).json({ error: 'Aucune répétition trouvée.' });
    }

    // Assuming 'etat' is a field in your Repetition model
    for (const repetition of repetitionsToUpdate) {
      console.log(`Updating repetition ${repetition._id}...`);
      repetition.etat = 'Done';
      await repetition.save();
    }

    console.log('Repetitions updated successfully.');
  } catch (error) {
    console.error("Erreur lors de la mise à jour des répétitions :", error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour des répétitions" });
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

const repetitionPourcentage = async (req, res) => {
  try {
    const {
      date,
      heureDebut,
      heureFin,
      lieu,
      liste_Presents,
      liste_Abs,
      prcSoprano,
      prcAlto,
      prcTenor,
      prcBasse,
      link,
    } = req.body;

    // Vérifiez que les pourcentages sont fournis et valides
    const totalChoristes = liste_Presents.length; // Supposons que la liste_Presents contienne tous les choristes disponibles

    if (
      !Number.isInteger(prcSoprano) ||
      !Number.isInteger(prcAlto) ||
      !Number.isInteger(prcTenor) ||
      !Number.isInteger(prcBasse) ||
      prcSoprano + prcAlto + prcTenor + prcBasse !== 100
    ) {
      return res.status(400).json({
        success: false,
        message: 'Les pourcentages des pupitres ne sont pas valides ou ne totalisent pas 100%.',
      });
    }

    // Calculez le nombre de choristes nécessaires pour chaque pupitre
    const nbChoristesSoprano = Math.round((prcSoprano / 100) * totalChoristes);
    console.log('le nombre de choristes Soprano demandé est : ', nbChoristesSoprano)
    const nbChoristesAlto = Math.round((prcAlto / 100) * totalChoristes);
    console.log('le nombre de choristes Alto demandé est : ', nbChoristesAlto)
    const nbChoristesTenor = Math.round((prcTenor / 100) * totalChoristes);
    console.log('le nombre de choristes Tenor demandé est : ', nbChoristesTenor)
    const nbChoristesBasse = Math.round((prcBasse / 100) * totalChoristes);
    console.log('le nombre de choristes Basse demandé est : ', nbChoristesBasse)

    const listeChoristesSoprano = await Choriste.find({ _id: { $in: liste_Presents }, pupitre: 'Soprano' });
    //console.log('la liste Soprano est : ', listeChoristesSoprano);
    const listeChoristesBasse = await Choriste.find({ _id: { $in: liste_Presents }, pupitre: 'Basse'});
    //console.log('la liste Basse est : ', listeChoristesBasse);
    const listeChoristesTenor = await Choriste.find({ _id: { $in: liste_Presents }, pupitre: 'Tenor' });
    //console.log('la liste Tenor est : ', listeChoristesTenor);
    const listeChoristesAlto = await Choriste.find({ _id: { $in: liste_Presents } , pupitre: 'Alto'});
    //console.log('la liste Alto est : ', listeChoristesAlto);

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
      liste_Presents,
      liste_Abs,
      prcSoprano,
      prcAlto,
      prcTenor,
      prcBasse,
      link,
      listeSoprano,
      listeAlto,
      listeTenor,
      listeBasse,
    });


    // Enregistrez la nouvelle répétition dans la base de données
    await nouvelleRepetition.save();
const listeSopranoDetails = await Choriste.find({ _id: { $in: listeSoprano } }, 'nom prenom pupitre');
const listeAltoDetails = await Choriste.find({ _id: { $in: listeAlto } }, 'nom prenom pupitre');
const listeTenorDetails = await Choriste.find({ _id: { $in: listeTenor } }, 'nom prenom pupitre');
const listeBasseDetails = await Choriste.find({ _id: { $in: listeBasse } }, 'nom prenom pupitre');

console.log('La liste des choristes Soprano :', listeSopranoDetails);
console.log('La liste des choristes Basse :', listeAltoDetails);
console.log('La liste des choristes Tenor :', listeTenorDetails);
console.log('La liste des choristes Alto :', listeBasseDetails);



    // Répondez avec succès
    res.status(200).json({ success: true, message: 'Répétition ajoutée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la répétition :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de la répétition.' });
  }
};

module.exports = {
  addRepetition,
  getPlanning,
  fetchRepetition,
  updateRepetition,
  deleteRepetition,
  getPlanningByDate,
  repetitionPourcentage
};

