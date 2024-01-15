const Concert = require("../models/concert.js");
const crypto = require('crypto');
const _ = require('lodash');
const Choriste = require('../models/choriste');
const mongoose = require('mongoose');
const Programme = require('../models/programme.js');
const Oeuvre= require('../models/oeuvre.js');
const Repetition= require('../models/repetition.js');
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

const attribuerPlaces = (listeChoristes, pupitre) => {
  // Déclaration de sceneDivisee à l'intérieur de la fonction
  
  const choristesTriés = listeChoristes.filter(choriste => choriste.pupitre === pupitre).sort(trierParTaille);
  //console.log(`Choristes triés pour ${pupitre} :`, choristesTriés);
  console.log('------------------------------------------');
  console.log(`Nombre de choristes de ${pupitre}:`, choristesTriés.length);
  sceneDivisee = _.chunk(Array.from({ length: choristesTriés.length }), 2);

  let index = 0;
  let placesAttribuées = 0;

  for (let i = 0; i < sceneDivisee.length; i++) {
    for (let j = 0; j < sceneDivisee[i].length; j++) {
      if (index < choristesTriés.length && placesAttribuées < choristesTriés.length) {
        const placeAttribuee = {
          nom: choristesTriés[index].nom,
          Taille: choristesTriés[index].Taille,
          pupitre
        };
        sceneDivisee[i][j] = placeAttribuee;
        index++;
        placesAttribuées++;
      } else {
        console.error(`Erreur : Tous les choristes n'ont pas été attribués pour ${pupitre}. Index : ${index} Choristes restants : ${choristesTriés.slice(index)}`);
        return;
      }
    }
  }
  
  // Affichage de la scèneDivisee en tant que matrice avec les noms des choristes
  console.log(`Placement sur scène pour ${pupitre}:`);
  sceneDivisee.forEach(row => {
    console.log(row.map(place => (place ? `${place.nom} (${place.Taille} cm) ${place.pupitre} |` : '______ ')).join('\t'));
  });
  return sceneDivisee;
};

const attribuerPlacesAuxChoristesPresentAuConcert = async (req, res) => {
  try {
    const { concertId } = req.body;
    console.log('ID de concert reçu :', concertId);

    const concert = await Concert.findById(concertId);
    if (!concert) {
      console.error('Concert non trouvé.');
      return;
    }

    const choristesPresentIds = concert.liste_Presents.map(String);
    const choristesPresent = await Choriste.find({ _id: { $in: choristesPresentIds } });

    // Trier tous les choristes présents avant d'attribuer les places
    const choristesTriés = choristesPresent.sort(trierParTaille);
    sceneDivisee = _.chunk(Array.from({ length: choristesTriés.length }), 2);

    // Attribuer des places pour chaque pupitre
    const placements = {
      soprano: attribuerPlaces(choristesTriés, 'Soprano'),
      alto: attribuerPlaces(choristesTriés, 'Alto'),
      tenor: attribuerPlaces(choristesTriés, 'Tenor'),
      basse: attribuerPlaces(choristesTriés, 'Basse'),
    };
        // Sauvegarder les placements dans le document du concert
        concert.placements = placements;
        await concert.save();
    

    console.log('Places attribuées avec succès aux choristes présents.');
  } catch (error) {
    console.error('Erreur lors de l\'attribution des places aux choristes présents :', error);
  }
};

const afficherPlacements = async (req, res) => {
    try {
      const { id } = req.params;
      console.log('ID de concert demandé :', id);
  
      const concert = await Concert.findById(id);
      if (!concert) {
        console.error('Concert non trouvé.');
        return res.status(404).json({ error: 'Concert non trouvé' });
      }
  
      const placements = concert.placements;
  
      // Affichage détaillé des placements
      Object.keys(placements).forEach(pupitre => {
        console.log(`Placement sur scène pour ${pupitre}:`);
        placements[pupitre].forEach(row => {
          console.log(row.map(place => (place ? `${place.nom} (${place.Taille} cm) ${place.pupitre} |` : '______ ')).join('\t'));
        });
        console.log('-'.repeat(42));
      });
  
      res.status(200).json({ message: 'Placements du concert affichés avec succès.' });
    } catch (error) {
      console.error('Erreur lors de l\'affichage des placements :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  // const modifierPlace = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     console.log('ID de concert demandé :', id);
  //     const { pupitre, position, nouveauChoristeId } = req.body;
  
  //     const concert = await Concert.findById(id);
  //     console.log('Détails du concert :', concert);

  //     if (!concert) {
  //       console.error('Concert non trouvé.');
  //       return res.status(404).json({ success: false, message: 'Concert non trouvé.' });
  //     }
  
  //     // Vérifier que la position spécifiée est valide
  //     const { ligne, colonne } = position;
  //     if (!Number.isInteger(ligne) || !Number.isInteger(colonne) || ligne < 0 || colonne < 0) {
  //       console.error('Position invalide spécifiée.');
  //       return res.status(400).json({ success: false, message: 'Position invalide spécifiée.' });
  //     }
  
  //     // Vérifier l'existence du pupitre dans la matrice de placements
  //     if (!concert.placements || !concert.placements[pupitre]) {
  //       console.error('Pupitre ou matrice de placements non trouvée.');
  //       return res.status(404).json({ success: false, message: 'Pupitre ou matrice de placements non trouvée.' });
  //     }
      
  
  //     // Vérifier que la place spécifiée existe dans la matrice
  //     const ligneExists = concert.placements[pupitre][ligne];
  //     if (!ligneExists || !concert.placements[pupitre][ligne][colonne]) {
  //       console.error('Place spécifiée non trouvée.');
  //       return res.status(404).json({ success: false, message: 'Place spécifiée non trouvée.' });
  //     }
  
  //     // Récupérer les détails du nouveau choriste à partir de son ID
  //     const nouveauChoriste = await Choriste.findById(nouveauChoristeId);
  //     if (!nouveauChoriste) {
  //       console.error('Choriste non trouvé.');
  //       return res.status(404).json({ success: false, message: 'Choriste non trouvé.' });
  //     }
  
  //     // Mettre à jour la place dans le pupitre spécifié
  //     concert.placements[pupitre][ligne][colonne] = {
  //       nom: nouveauChoriste.nom,
  //       Taille: nouveauChoriste.Taille,
  //       pupitre: nouveauChoriste.pupitre,
  //     };
  
  //     // Sauvegarder les modifications
  //     await concert.save();
  
  //     console.log('Place modifiée avec succès.');
  //     res.status(200).json({
  //       success: true,
  //       message: 'Place modifiée avec succès',
  //       nouveauChoriste: {
  //         nom: nouveauChoriste.nom,
  //         taille: nouveauChoriste.Taille,
  //         pupitre: nouveauChoriste.pupitre,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors de la modification de la place :', error);
  //     res.status(500).json({ success: false, message: 'Erreur lors de la modification de la place.' });
  //   }
  // };
  

  const getStatisticConcert = async (req, res) => {
    try {
      const concert = await Concert.findById(req.params.id).populate('liste_Presents liste_Abs');
  
      // Récupérer les détails de l'œuvre spécifique
      const oeuvreSpecifique = await Programme.findOne({ theme: "Classical Masterpieces" });
  
      // Calculer le nombre de présences et d'absences au concert
      const nbrePresences = concert.liste_Presents.length;
      const nbreAbsences = concert.liste_Abs.length;
  
      // Récupérer les détails des œuvres associées au concert (sans afficher l'ID)
      const programmeIds = concert.programme.map(programme => programme._id);
      const programmes = await Programme.find({ _id: { $in: programmeIds } });
  
      // Récupérer les détails de chaque œuvre associée à un programme
      const detailsOeuvres = await Promise.all(programmes.map(async (programme) => {
        return {
          theme: programme.theme,
          oeuvre: await Promise.all(programme.oeuvre.map(async (oeuvreId) => {
            // Récupérer les détails de chaque œuvre
            const oeuvreDetails = await Oeuvre.findById(oeuvreId).select('-_id');
            return oeuvreDetails;
          })),
        };
      }));
  
      const statistics = {
        concert,
        presenceStats: { nbrePresences, nbreAbsences },
        oeuvreSpecifique,
        programmes: detailsOeuvres,
      };
  
      // Envoyer la réponse à la requête HTTP
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const getStatisticChoriste = async (req, res) => {
    try {
      const choriste = await Choriste.findById(req.params.id);
  
      if (!choriste) {
        return res.status(404).json({ error: 'Choriste non trouvé' });
      }
  
      const nbreAbsencesRepetitions = choriste.absences.length;
      const nbreParticipationsRepetitions = choriste.nbr_repetitions;
      const nbreAbsencesConcerts = choriste.concertsParticipes.filter(concert => !concert.presence).length;
      const nbreParticipationsConcerts = choriste.concertsParticipes.filter(concert => concert.presence).length;
  
      const maîtriseOeuvres = choriste.concertsParticipes.map(concert => {
        return concert.concertId?.programme?.length || 0;
      });
  
      const totalOeuvresMaitrises = maîtriseOeuvres.reduce((acc, val) => acc + val, 0);
  
      // Nouveaux champs pour les concerts et répétitions présents
      const concertsPresent = [];
      const repetitionsPresent = [];
  
      // Vérifier la présence dans les concerts
      const concerts = await Concert.find({ liste_Presents: choriste._id }).populate('programme');
      concertsPresent.push(...concerts.map(concert => concert._id));
  
      // Vérifier la présence dans les répétitions
      const repetitions = await Repetition.find({ liste_Presents: choriste._id });
      repetitionsPresent.push(...repetitions.map(repetition => repetition._id));
  
      // Récupérer les détails complets des concerts et répétitions
      const concertsDetails = await Concert.find({ _id: { $in: concertsPresent } }).populate('programme');
      const repetitionsDetails = await Repetition.find({ _id: { $in: repetitionsPresent } });
  
      // Calculer la maîtrise des œuvres
      const oeuvresChantees = choriste.concertsParticipes.reduce((acc, concert) => {
        if (concert.presence && concert.concertId && concert.concertId.programme) {
          concert.concertId.programme.forEach(oeuvre => {
            acc[oeuvre] = (acc[oeuvre] || 0) + 1;
          });
        }
        return acc;
      }, {});
  
      const statistics = {
        nbreAbsencesRepetitions,
        nbreParticipationsRepetitions,
        nbreAbsencesConcerts,
        nbreParticipationsConcerts,
        totalOeuvresMaitrises,
        concertsPresent: concertsDetails,
        repetitionsPresent: repetitionsDetails,
        oeuvresChantees,
      };
  
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };
  
  const getStatisticsByOeuvre = async (req, res) => {
    try {
      const idOeuvre = req.params.id;
  
      // Récupérez l'œuvre par son ID
      const oeuvre = await Oeuvre.findById(idOeuvre);
  
      if (!oeuvre) {
        return res.status(404).json({ error: 'Œuvre non trouvée' });
      }
  
      const concerts = await Concert.find({ 'programme': idOeuvre });
  
      // Initialisez les listes d'absences et de présences
      const absences = [];
      const presences = new Set();
      const presens= new Set();
      const concertsAvecOeuvre = [];
  
      // Parcourez les concerts pour récupérer la liste d'absence et de présence
      for (const concert of concerts) {
        concertsAvecOeuvre.push({
          concertId: concert._id,
          date: concert.date,
          lieu: concert.lieu,
        });
  
        for (const participantId of concert.liste_Presents) {
          const choriste = await Choriste.findById(participantId);
          if (choriste) {
            const presenceDetails = {
              choristeId: choriste._id,
              nom: choriste.nom,
              concertId: concert._id,
              date: concert.date,
              // Ajoutez d'autres détails du choriste si nécessaire
            };
  
            // Ajoutez le choriste à l'ensemble des présences
            presences.add(JSON.stringify(presenceDetails));
            presens.add(participantId)
          }
        }
  
        for (const participant of concert.liste_Abs) {
          const choriste = await Choriste.findById(participant);
          if (choriste) {
            const absenceDetails = {
              choristeId: choriste._id,
              nom: choriste.nom,
              concertId: concert._id,
              date: concert.date,
              // Ajoutez d'autres détails du choriste si nécessaire
            };
  
            absences.push(absenceDetails);
          }
        }
      }
  
      // Convertissez l'ensemble des présences en tableau
      const presencesArray = Array.from(presences).map(presence => JSON.parse(presence));
      
      const statistics = {
        absences,
        presences: presencesArray,
        concertsAvecOeuvre,
        totalParticipants: concerts.length,
        participantsPresent: presens.size,
        participantsAbsent: absences.size,
      };
  
      res.json(statistics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };
  
  

  
  
  
  
  
  
  
  
module.exports = {
  addConcert,
  fetchConcert,
  updateConcert,
  deleteConcert,
  attribuerPlacesAuxChoristesPresentAuConcert,
  afficherPlacements,
  getStatisticConcert,
  getStatisticChoriste,
  getStatisticsByOeuvre
  //modifierPlace
}
