const Concert = require("../models/concert.js");
const crypto = require('crypto');
const _ = require('lodash');
const Choriste = require('../models/choriste');
const mongoose = require('mongoose');


const addConcert = (req, res) => {
  // Get and validate concert date
  const concertDateString = req.body.date;
  const randomLink = crypto.randomBytes(5).toString('hex');
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(concertDateString)) {
    return res
      .status(400)
      .send("Invalid concert date format. Please use YYYY-MM-DD format.");
  }

  const concertDate = new Date(concertDateString);

  const moment = require("moment");

  const dateString = req.body.date;
  const dateObject = moment(dateString, "YYYY-MM-DD", true).toDate();
  if (moment(dateObject).isValid()) {
    // The date is valid
    console.log('Parsed Date:', dateObject);
  } else {
    // The date is invalid
    console.error('Invalid Date Format');
  }
  Concert.create({ ...req.body, date: dateObject , link: randomLink,})

    .then((concert) => res.status(201).json({
      model: concert,
      message: "Concert crée!",
    }))
    .catch((error) => {
      if (error.errors) {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ errors });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    });
};





const fetchConcert = (req, res) => {
  Concert.find().populate("programme")
    .then((concerts) => {
      res.status(200).json(concerts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

const updateConcert = (req, res) => {
  Concert.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true }
  )
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: "Concert non trouvé",
        });
      } else {
        res.status(200).json({
          model: concert,
          message: "Concert modifié",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

const deleteConcert = (req, res) => {
  Concert.deleteOne({ _id: req.params.id })
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: " Concert non supprimé!",
        });
      } else {
        res.status(200).json({
          model: concert,
          message: "Concert supprimé!",
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




// 1. Fonction de tri par taille
const trierParTaille = (a, b) => b.Taille - a.Taille;

// 2. Diviser la scène en sous-matrices de (2,3) pour chaque pupitre
const sceneDivisee = _.chunk(Array.from({ length: 20 }), 4); // 4 rangées x 4 places

// 3. Attribuer des places aux choristes
const attribuerPlaces = (listeChoristes, pupitre) => {

  const choristesTriés = listeChoristes.filter(choriste => choriste.pupitre === pupitre).sort(trierParTaille);
  console.log('Choristes triés :', choristesTriés);
  let index = 0;
  for (let i = 0; i < sceneDivisee.length; i++) {
    for (let j = 0; j < sceneDivisee[i].length; j++) {
      if (index < choristesTriés.length) {
        const placeAttribuee = {
          nom: choristesTriés[index].nom,
          taille: choristesTriés[index].Taille,
          pupitre
        };
        sceneDivisee[i][j] = placeAttribuee;
        console.log(`Place attribuée à ${placeAttribuee.nom} (${placeAttribuee.taille} cm) - Pupitre: ${placeAttribuee.pupitre}`);
        index++;
      } else {
        console.error(`Erreur : Tous les choristes n'ont pas été attribués. Index : ${index} Choristes restants : ${choristesTriés.slice(index)}`);
        return; // Ajoutez cette ligne pour sortir de la fonction si tous les choristes ont été attribués
      }
    }
  }
};



const attribuerPlacesAuxChoristesPresentAuConcert = async (req, res) => {
  try {
    // Assurez-vous que le corps de la demande est analysé en tant qu'objet JSON
    const { concertId } = req.body;
    console.log('ID de concert reçu :', concertId);

    const concert = await Concert.findById(concertId);
    if (!concert) {
      console.error('Concert non trouvé.');
      return;
    }

    // Nettoyez les IDs des choristes présents
    const choristesPresentIds = concert.liste_Presents.map(String);  

    const choristesPresent = await Choriste.find({ _id: { $in: choristesPresentIds } });
    console.log('Choristes présents :', choristesPresent);


    // Attribuer des places aux choristes présents
    attribuerPlaces(choristesPresent, 'Soprano');
    attribuerPlaces(choristesPresent, 'Alto');
    attribuerPlaces(choristesPresent, 'Tenor');
    attribuerPlaces(choristesPresent, 'Basse');

    // Mettez à jour la liste_Presents dans le document du concert
    sceneDivisee.forEach(row => {
      console.log(row.map(place => (place ? `${place.nom} (${place.taille} cm) ${place.pupitre}` : '______')).join('\t'));
    });
      await concert.save();

    console.log('Places attribuées avec succès aux choristes présents.');
  } catch (error) {
    console.error('Erreur lors de l\'attribution des places aux choristes présents :', error);
  }
}



// Affichage de la scèneDivisee en tant que matrice avec les noms des choristes
console.log("Matrice de la scène :");
sceneDivisee.forEach(row => {
  console.log(row.map(place => (place ? `${place.nom} (${place.Taille} cm) ${place.pupitre}` : '______')).join('\t'));
});


module.exports = {
  addConcert,
  fetchConcert,
  updateConcert,
  deleteConcert,
  attribuerPlacesAuxChoristesPresentAuConcert
}
