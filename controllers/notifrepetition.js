const cron = require("node-cron");
const choriste = require("../models/choriste");
const Utilisateur = require("../models/utilisateur");
const moment = require("moment");

let notif;
const envoyerNotification = async (req, res) => {
  const repetitions = req.params.repetitions;
  const heure = req.params.heure;
  const joursavantrep = req.params.jar;

  //date et heure de l'envoie
  const dateCible = moment("2023-12-23T00:00:00.000+00:00"); // Date de répétition
  const nJoursAvant = dateCible.subtract(joursavantrep, "days");
  const jour = nJoursAvant.date();
  const mois = nJoursAvant.month() + 1; // Les mois vont de 0 à 11

  //Choriste
  const choristesConcernes = await choriste.find({ statut: "Actif" });
  console.log(choristesConcernes);

  if (notif) {
    notif.stop();
  }

  let count = 0;
  notif = cron.schedule(
    `0 ${heure} ${jour} ${mois} *`, // Syntaxe du cron : seconde minute heure jour mois *
    () => {
      count++;
      choristesConcernes.forEach((choriste) => {
        console.log(
          `Rappelez-vous ! Vous avez une répétition le ..... (fois ${count}/${repetitions})`
        );
      });
      
      if (count >= repetitions) {
        notif.stop();
        count = 0;
      }
    },
    {
      scheduled: false,
    }
  );

  notif.start();
};

///////////////////////////////////////////////////////////////////////////
let notiff;
const envoyerNotificationChangement = async (req, res) => {
  const nouvelHoraire = req.params.nh;
  const nouveauLieu = req.params.nl;
  const maintenant = new Date();
  const heureActuelle = maintenant.getHours();
  const minuteActuelle = maintenant.getMinutes() + 1;

  notiff = cron.schedule(
    `${minuteActuelle} ${heureActuelle} * * *`,
    () => {
      console.log(
        `Changement d'horaire : ${nouvelHoraire}h, Nouveau lieu : ${nouveauLieu}`
      );
    },
    {
      scheduled: false,
    }
  );

  notiff.start();
};

module.exports = {
  envoyerNotification,
  envoyerNotificationChangement,
};
