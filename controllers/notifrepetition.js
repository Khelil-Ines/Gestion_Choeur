const cron = require("node-cron");
const choriste = require("../models/choriste");
const Répetition = require("../models/repetition");
const moment = require("moment");

let notif;
const envoyerNotification = async (req, res) => {
  const { repetitions, heure, minute, jar } = req.params;

  const dateCible = moment("2023-12-25T00:00:00.000+00:00");
  const nJoursAvant = dateCible.subtract(jar, "days");
  let jour = nJoursAvant.date();
  const mois = nJoursAvant.month() + 1;

  const choristesConcernes = await choriste.find({ statut: "Actif" });

  if (notif) {
    notif.stop();
  }

  let count = 0;
  notif = cron.schedule(
    `${minute} ${heure} ${jour} ${mois} *`,
    () => {
      count++;
      jour++;
      choristesConcernes.forEach((choriste) => {
        console.log(
          `M./Mme ${choriste.nom}, Rappelez-vous ! Vous avez une répétition le ... (fois ${count}/${repetitions})`
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
const envoyerNotificationChangementRépetition = async (req, res) => {
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

///////////////////////////////////////////////////////////
const envoyerNotificationChangementAutre = async (req, res) => {
  const { changement, message } = req.body;
  console.log(changement);
  console.log(message);

  const maintenant = new Date();
  let heureActuelle = maintenant.getHours();
  let minuteActuelle = maintenant.getMinutes() + 1;

  const notific = cron.schedule(
    `${minuteActuelle} ${heureActuelle} * * *`,
    () => {
      console.log(`Changement de: ${changement}, Message: ${message}`);
    },
    {
      scheduled: true,
    }
  );

  notific.start();
};

module.exports = {
  envoyerNotification,
  envoyerNotificationChangementRépetition,
  envoyerNotificationChangementAutre,
};
