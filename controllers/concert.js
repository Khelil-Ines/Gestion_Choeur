const Concert = require("../models/concert.js");
const crypto = require("crypto");
const _ = require("lodash");
const Choriste = require("../models/choriste");
const mongoose = require("mongoose");
const Programme = require("../models/programme.js");
const Oeuvre = require("../models/oeuvre.js");
const Repetition = require("../models/repetition.js");



const cron = require('node-cron');


const ConcertFinie = cron.schedule('11 16 * * *', async () => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const concerts = await Concert.find()
    for (const concert of concerts) {
      if (concert.date.setHours(0, 0, 0, 0) <= today) {
        console.log(`Updating concert ${concert._id}...`);
        concert.etat = "Done";
        await concert.save();
        console.log('concerts updated successfully.');

      }
    }
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour des concert :", error);
  }
});

ConcertFinie.start();


function generateRandomURL() {
  // Define the characters that can be used in the random URL
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Start the random URL with 'https:'
  let randomURL = 'https:';

  // Generate 10 random characters and append them to the URL
  for (let i = 0; i < 10; i++) {
      // Select a random character from the characters string
      randomURL += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Append the '.com' domain to complete the URL
  randomURL += '.com';

  // Return the generated random URL
  return randomURL;
}
const addConcert = async (req, res) => {
  // Get and validate concert date
  const concertDateString = req.body.date;
  const randomLink = generateRandomURL();

  const concertDate = new Date(concertDateString);

  // Check if concert date is greater than or equal to the current date
  const currentDate = new Date();
  if (concertDate < currentDate) {
    return res
      .status(400)
      .send("Invalid concert date. Please choose a date greater than or equal to the current date.");
  }
  const programme = await Programme.findOne({ _id: req.body.programme });
  if (!programme) {
    return res.status(400).send("Invalid programme ID. Please choose a valid programme ID.");
  }else{

  const moment = require("moment");

  const dateString = req.body.date;
  const dateObject = moment(dateString, "YYYY-MM-DD", true).toDate();
  if (moment(dateObject).isValid()) {
    // The date is valid
    console.log("Parsed Date:", dateObject);
  } else {
    // The date is invalid
    console.error("Invalid Date Format");
  }


  Concert.create({ ...req.body, link: randomLink })
  .then((concert) =>
    res.status(201).json({
      model: concert,
      message: "Concert créé!",
    })
  )
    .catch((error) => {
      if (error.errors) {
        const errors = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({ errors });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    });
}
}


const fetchConcert = (req, res) => {
  Concert.find()
    .populate("programme")
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
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "Concert non trouvé !",
        });
      } else {
        res.status(200).json({
          model: result,
          message: "Concert supprimé!",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
        message: "Données invalides!",
      });
    });
};

// 1. Fonction de tri par taille
const trierParTaille = (a, b) => b.Taille - a.Taille;

const attribuerPlaces = (listeChoristes, pupitre) => {
  // Déclaration de sceneDivisee à l'intérieur de la fonction

  const choristesTriés = listeChoristes
    .filter((choriste) => choriste.pupitre === pupitre)
    .sort(trierParTaille);
  //console.log(`Choristes triés pour ${pupitre} :`, choristesTriés);
  console.log("------------------------------------------");
  console.log(`Nombre de choristes de ${pupitre}:`, choristesTriés.length);
  sceneDivisee = _.chunk(Array.from({ length: choristesTriés.length }), 2);

  let index = 0;
  let placesAttribuées = 0;

  for (let i = 0; i < sceneDivisee.length; i++) {
    for (let j = 0; j < sceneDivisee[i].length; j++) {
      if (
        index < choristesTriés.length &&
        placesAttribuées < choristesTriés.length
      ) {
        const placeAttribuee = {
          nom: choristesTriés[index].nom,
          Taille: choristesTriés[index].Taille,
          pupitre,
        };
        sceneDivisee[i][j] = placeAttribuee;
        index++;
        placesAttribuées++;
      } else {
        console.error(
          `Erreur : Tous les choristes n'ont pas été attribués pour ${pupitre}. Index : ${index} Choristes restants : ${choristesTriés.slice(
            index
          )}`
        );
        return;
      }
    }
  }

  // Affichage de la scèneDivisee en tant que matrice avec les noms des choristes
  console.log(`Placement sur scène pour ${pupitre}:`);
  sceneDivisee.forEach((row) => {
    console.log(
      row
        .map((place) =>
          place
            ? `${place.nom} (${place.Taille} cm) ${place.pupitre} |`
            : "______ "
        )
        .join("\t")
    );
  });
  return sceneDivisee;
};

const attribuerPlacesAuxChoristesPresentAuConcert = async (req, res) => {
  try {
    const { concertId } = req.body;
    console.log("ID de concert reçu :", concertId);

    const concert = await Concert.findById(concertId);
    if (!concert) {
      console.error("Concert non trouvé.");
      return;
    }

    const choristesPresentIds = concert.liste_Abs.map(String);
    const choristesPresent = await Choriste.find({
      _id: { $in: choristesPresentIds },
    });

    // Trier tous les choristes présents avant d'attribuer les places
    const choristesTriés = choristesPresent.sort(trierParTaille);
    sceneDivisee = _.chunk(Array.from({ length: choristesTriés.length }), 2);

    // Attribuer des places pour chaque pupitre
    const placements = {
      soprano: attribuerPlaces(choristesTriés, "Soprano"),
      alto: attribuerPlaces(choristesTriés, "Alto"),
      tenor: attribuerPlaces(choristesTriés, "Tenor"),
      basse: attribuerPlaces(choristesTriés, "Basse"),
    };
    // Sauvegarder les placements dans le document du concert
    concert.placements = placements;
    await concert.save();

    console.log("Places attribuées avec succès aux choristes présents.");
  } catch (error) {
    console.error(
      "Erreur lors de l'attribution des places aux choristes présents :",
      error
    );
  }
};

const afficherPlacements = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID de concert demandé :", id);

    const concert = await Concert.findById(id);
    if (!concert) {
      console.error("Concert non trouvé.");
      return res.status(404).json({ error: "Concert non trouvé" });
    }

    const placements = concert.placements;

    // Affichage détaillé des placements
    Object.keys(placements).forEach((pupitre) => {
      console.log(`Placement sur scène pour ${pupitre}:`);
      placements[pupitre].forEach((row) => {
        console.log(
          row
            .map((place) =>
              place
                ? `${place.nom} (${place.Taille} cm) ${place.pupitre} |`
                : "______ "
            )
            .join("\t")
        );
      });
      console.log("-".repeat(42));
    });

    res
      .status(200)
      .json({ message: "Placements du concert affichés avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'affichage des placements :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



const getStatisticChoriste = async (id) => {
  try {
    const choriste = await Choriste.findById(id);

    if (!choriste) {
      return { error: "Choriste non trouvé" };
    }

    console.log(choriste);
    const concertsDetails = await Concert.find({ etat: "Done" });
    // Récupérer les détails des concerts où le choriste est absent
    const concertsAbsents = concertsDetails
      .map((concert) => {
        // Vérifier si l'ID du choriste est présent dans la liste_Abs
        const isAbsent = concert.liste_Abs.includes(choriste._id);

        // Retourner le concert uniquement si le choriste est absent
        return isAbsent ? concert : null;
      })
      .filter(Boolean); // Filtrer les valeurs null du tableau

    // Récupérer les détails des concerts où le choriste est présent
    const concertsPresents = concertsDetails
      .map((concert) => {
        // Vérifier si l'ID du choriste est présent dans la liste_Presents
        const isPresent = concert.liste_Presents.includes(choriste._id);

        // Retourner le concert uniquement si le choriste est présent
        return isPresent ? concert : null;
      })
      .filter(Boolean); // Filtrer les valeurs null du tableau

    // Calculer le nombre d'absences aux concerts
    const nbreAbsencesConcerts = concertsAbsents.length;

    // Calculer le nombre de participations aux concerts
    const nbreParticipationsConcerts = concertsPresents.length;

    // Afficher le nombre d'absences aux concerts
    console.log(`Nombre d'absences aux concerts: ${nbreAbsencesConcerts}`);

    // Afficher le nombre de participations aux concerts
    console.log(
      `Nombre de participations aux concerts: ${nbreParticipationsConcerts}`
    );

    const repetitionsDetails = await Repetition.find({ etat: "Done" });;

    // Mapper et filtrer les répétitions où le choriste est présent
    const repetitionsPresent = repetitionsDetails
      .map((repetition) => {
        // Vérifier si l'ID du choriste est présent dans la liste_Presents
        const isPresent = repetition.liste_Presents.includes(choriste._id);

        // Retourner les détails de la répétition uniquement si le choriste est présent
        return isPresent ? repetition : null;
      })
      .filter(Boolean); // Filtrer les valeurs null du tableau
    // Calculer le nombre de participations aux répétitions
    const nbreParticipationsRepetitions = repetitionsPresent.length;

    // Récupérer les détails des répétitions où le choriste est absent
    const repetitionsAbsences = repetitionsDetails
      .map((repetition) => {
        // Vérifier si l'ID du choriste est présent dans la liste_Abs
        const isAbsent = repetition.liste_Abs.includes(choriste._id);

        // Retourner la répétition uniquement si le choriste est absent
        return isAbsent ? repetition : null;
      })
      .filter(Boolean); // Filtrer les valeurs null du tableau

    // Calculer le nombre d'absences aux répétitions
    const nbreAbsencesRepetitions = repetitionsAbsences.length;
    // Créez un tableau pour stocker les œuvres chantées
    const toutesLesOeuvresChantees = [];

    // Parcourez tous les concerts présents
    for (const concert of concertsPresents) {
      // Vérifiez si le choriste est présent dans ce concert
      const choristePresent = concert.liste_Presents.includes(choriste._id);

      // Si le choriste est présent, ajoutez les œuvres du programme
      if (choristePresent) {
        // Obtenez les détails des programmes pour ce concert
        const programmes = await Programme.find({
          _id: { $in: concert.programme },
        });

        // Ajoutez les œuvres de chaque programme à toutesLesOeuvresChantees
        programmes.forEach((programme) => {
          programme.oeuvre.forEach((oeuvre) => {
            toutesLesOeuvresChantees.push(oeuvre);
          });
        });
      }
    }

    // Parcourez tous les concerts présents
    for (const concert of concertsPresents) {
      const choristePresent = concert.liste_Presents.includes(choriste._id);

      if (choristePresent) {
        const programmes = await Programme.find({
          _id: { $in: concert.programme },
        });

        programmes.forEach((programme) => {
          programme.oeuvre.forEach((oeuvre) => {
            toutesLesOeuvresChantees.push(oeuvre);
          });
        });
      }
    }

    // Utilisez un objet pour stocker le nombre de fois que chaque œuvre a été chantée
    const oeuvresChanteesCount = {};

    // Parcourez tous les concerts présents
    for (const concert of concertsPresents) {
      const choristePresent = concert.liste_Presents.includes(choriste._id);

      if (choristePresent) {
        const programmes = await Programme.find({
          _id: { $in: concert.programme },
        });

        programmes.forEach((programme) => {
          programme.oeuvre.forEach((oeuvre) => {
            // Incrémente le compteur pour cette œuvre
            oeuvresChanteesCount[oeuvre] =
              (oeuvresChanteesCount[oeuvre] || 0) + 1;
          });
        });
      }
    }

    // Filtrer les œuvres maîtrisées (chantées plus d'une fois)
    const oeuvresMaitrisees = Object.keys(oeuvresChanteesCount).filter(
      (oeuvre) => oeuvresChanteesCount[oeuvre] > 1
    );

    // Créez un tableau pour stocker les détails des œuvres maîtrisées
    const detailsOeuvresMaitrisees = [];

    // Parcourez les œuvres maîtrisées pour récupérer les détails
    for (const oeuvre of oeuvresMaitrisees) {
      console.log(oeuvre);
      const details = await Oeuvre.findOne({ _id: oeuvre });

      // Vérifiez si l'œuvre a été trouvée avant de l'ajouter au tableau
      if (details) {
        detailsOeuvresMaitrisees.push(details);
      }
    }

    const statistics = {
      nbreAbsencesRepetitions,
      nbreParticipationsRepetitions,
      nbreAbsencesConcerts,
      nbreParticipationsConcerts,
      nbreOeuvresMaitraisees: oeuvresMaitrisees.length,
      concertsPresent: concertsPresents,
      repetitionsPresent: repetitionsPresent,
      detailsOeuvresMaitrisees,
    };

    return statistics;
  } catch (error) {
    console.error(error);
    throw new Error("Erreur interne du serveur");
  }
};
const getStatisticsByOeuvre = async (id, res) => {
  try {
    const idOeuvre = id;

    // Récupérez l'œuvre par son ID
    const oeuvre = await Oeuvre.findById(idOeuvre);

    if (!oeuvre) {
      return res.status(404).json({ error: "Œuvre non trouvée" });
    }

    const allConcerts = await Concert.find({ etat: "Done" });

    // Initialize an array to store concerts with the specified oeuvre
    const concertsWithOeuvre = [];

    // Iterate through each concert
    for (const concert of allConcerts) {
      // Check if the concert has a 'programme' property
      if (concert.programme && Array.isArray(concert.programme)) {
        for (const program of concert.programme) {
          try {
            const programmeoeuvre = await Programme.findById(program);

            // Check if the program is found and has the 'oeuvre' property
            if (
              programmeoeuvre &&
              programmeoeuvre.oeuvre &&
              Array.isArray(programmeoeuvre.oeuvre)
            ) {
              // Check if the oeuvreId is present in the program's oeuvre array
              if (
                programmeoeuvre.oeuvre.some(
                  (oeuvreId) => oeuvreId && oeuvreId.equals(id)
                )
              ) {
                // If found, add the concert to the result array
                concertsWithOeuvre.push(concert);
              }
            }
          } catch (error) {
            console.error(
              `Error processing program ${program}: ${error.message}`
            );
            // Handle the error, maybe log it or skip this program
          }
        }
      }
    }

    // Initialisez les listes d'absences et de présences
    const absences = [];
    const presences = new Set();
    const presens = new Set();
    const concertsAvecOeuvre = [];

    // Parcourez les concerts pour récupérer la liste d'absence et de présence
    for (const concert of concertsWithOeuvre) {
      const programDetails = await Programme.findById(idOeuvre);

      if (programDetails) {
        concertsAvecOeuvre.push({
          concertId: concert._id,
          date: concert.date,
          lieu: concert.lieu,
          programme: programDetails,
        });
      }

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
          presens.add(participantId);
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
    const presencesArray = Array.from(presences).map((presence) =>
      JSON.parse(presence)
    );

    const allRepetitions = await Repetition.find({ etat: "Done" });

    // Initialize an array to store repetitions with the specified oeuvre
    const RepetitionWithOeuvre = [];

    // Iterate through each repetition
    for (const repetition of allRepetitions) {
      // Check if the repetition has a 'programme' property
      if (repetition.programme && Array.isArray(repetition.programme)) {
        console.log(repetition.programme)
        for (const program of repetition.programme) {
          try {
            const programmeoeuvre = await Programme.findById(program);

            // Check if the program is found and has the 'oeuvre' property
            if (
              programmeoeuvre &&
              programmeoeuvre.oeuvre &&
              Array.isArray(programmeoeuvre.oeuvre)
            ) {
              // Check if the oeuvreId is present in the program's oeuvre array
              if (
                programmeoeuvre.oeuvre.some(
                  (oeuvreId) => oeuvreId && oeuvreId.equals(id)
                )
              ) {
                // If found, add the repetition to the result array
                RepetitionWithOeuvre.push(repetition);
              }
            }
          } catch (error) {
            console.error(
              `Error processing program ${program}: ${error.message}`
            );
            // Handle the error, maybe log it or skip this program
          }
        }
      }
    }

    console.log(RepetitionWithOeuvre);

    // Initialisez les listes d'absences et de présences
    const Repetitionabsences = [];
    const repetitionPresence = new Set();
    const presence = new Set();
    const RepetitionAvecOeuvre = [];

    // Parcourez les concerts pour récupérer la liste d'absence et de présence
    for (const concert of RepetitionWithOeuvre) {
      const programDetails = await Programme.findById(idOeuvre);

      if (programDetails) {
        concertsAvecOeuvre.push({
          concertId: concert._id,
          date: concert.date,
          lieu: concert.lieu,
          programme: programDetails,
        });
      }

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
          presence.add(JSON.stringify(presenceDetails));
          repetitionPresence.add(participantId);
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

          Repetitionabsences.push(absenceDetails);
        }
      }
    }

// // Convert the set of presences to an array
const presencesRepetitionArray = Array.from(presence).map(
  (presences) => JSON.parse(presences));

    const statistics = {
      totalConcertParticipants: concertsWithOeuvre.length,
      participantsConcertPresent: presens.size,
      participantsConcertAbsent: absences.length,

      totalRepetitionParticipants: RepetitionWithOeuvre.length,
      participantsRepetitionPresent: repetitionPresence.size,
      participantsRepetitionAbsent: Repetitionabsences.length,

      concertsWithOeuvre,
      absences,
      

     
      RepetitionWithOeuvre,
      Repetitionabsences,
      
    };

    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { type, id } = req.query;

    if (!type || !id) {
      return res
        .status(400)
        .json({ error: 'Les paramètres "type" et "id" sont requis.' });
    }

    let statistics;

    switch (type) {
      case "concert":
        statistics = await getStatisticConcert(id,res);
        break;
      case "choriste":
        statistics = await getStatisticChoriste(id);
        break;
      case "oeuvre":
        statistics = await getStatisticsByOeuvre(id, res);
        break;
      default:
        return res
          .status(400)
          .json({ error: "Type de statistiques non pris en charge." });
    }

    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getStatisticConcert = async (id , res) => {
  try {
    const concert = await Concert.findById(id).populate(
      "liste_Presents liste_Abs"
    );

    // Check if the concert has the desired 'etat' property
if (concert.etat === "Done") {
  // Perform actions or return data related to a 'Done' concert
  console.log("Concert is Done:", concert);

    // Récupérer les détails de l'œuvre spécifique
    const oeuvreSpecifique = await Programme.findOne({
      theme: "Classical Masterpieces",
    });

    // Calculer le nombre de présences et d'absences au concert
    const nbrePresences = concert.liste_Presents.length;
    const nbreAbsences = concert.liste_Abs.length;

    // Récupérer les détails des œuvres associées au concert (sans afficher l'ID)
    const programmeIds = concert.programme.map((programme) => programme._id);
    const programmes = await Programme.find({ _id: { $in: programmeIds } });

    // Récupérer les détails de chaque œuvre associée à un programme
    const detailsOeuvres = await Promise.all(
      programmes.map(async (programme) => {
        return {
          theme: programme.theme,
          oeuvre: await Promise.all(
            programme.oeuvre.map(async (oeuvreId) => {
              // Récupérer les détails de chaque œuvre
              const oeuvreDetails = await Oeuvre.findById(oeuvreId).select(
                "-_id"
              );
              return oeuvreDetails;
            })
          ),
        };
      })
    );

    const statistics = {
      presenceStats: { nbrePresences, nbreAbsences },
      concert,

      oeuvreSpecifique,
      programmes: detailsOeuvres,
    };
       // Retourner les statistiques au lieu d'envoyer la réponse HTTP
       return statistics;
} else {
  return res.status(400).json({ error: "Concert is not in the 'Done' state" });
}

  } catch (error) {
    console.error(error);
    // Retourner une erreur
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  addConcert,
  fetchConcert,
  updateConcert,
  deleteConcert,
  attribuerPlacesAuxChoristesPresentAuConcert,
  afficherPlacements,
  getStatistics
  //modifierPlace
};
