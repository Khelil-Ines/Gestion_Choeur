const cron = require("node-cron");
const choriste = require("../models/choriste");
const moment = require("moment");

let notif;

const envoyerNotification = (req, res) => {
  const repetitions = req.params.repetitions;
  const heure = req.params.heure;
  const joursavantrep = req.params.jar;

  const dateCible = moment("2023-12-23T00:00:00.000+00:00"); // Date de répétition
  const nJoursAvant = dateCible.subtract(joursavantrep, "days");
  const jour = nJoursAvant.date();
  const mois = nJoursAvant.month() + 1; // Les mois vont de 0 à 11

  if (notif) {
    notif.stop();
  }

  let count = 0;
  notif = cron.schedule(
    `0 ${heure} ${jour} ${mois} *`, // Syntaxe du cron : seconde minute heure jour mois *
    () => {
      count++;
      console.log(
        `Rappelez-vous ! Vous avez une répétition le ..... (fois ${count}/${repetitions})`
      );
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

module.exports = {
  envoyerNotification,
};
