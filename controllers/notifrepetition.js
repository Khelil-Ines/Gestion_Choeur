const cron = require("node-cron");
const Choriste = require("../models/choriste");
const Répetition = require("../models/repetition");
const moment = require("moment");

//Rappel de répétition selon des paramétres
let notif;
const envoyerNotification = async (req, res) => {
   const { repetitions, heure, minute, jar } = req.params;
  const connecte = await Choriste.findOne({ compte: req.auth.compteId });
  const listerep = await Répetition.find();
  
  listerep.forEach((rep) => {
    const dateCible = moment(rep.date);
    const nJoursAvant = dateCible.subtract(jar, "days");
    let jour = nJoursAvant.date();
    const mois = nJoursAvant.month() + 1;
    let count = 0;
    notif = cron.schedule(
      `${minute} ${heure} ${jour} ${mois} *`,
      () => {
        count++;
        jour++;
        console.log(
          `M./Mme  ${connecte.nom}  ${connecte.prénom}, Rappelez-vous ! Vous avez une répétition le ${rep.date}  à ${rep.heureDebut}h `
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
  });
};

//Changement horaire ou lieu de répatition
let notiff;
const envoyerNotificationChangementRépetition = async (req, res) => {
  const nouvelHoraire = req.params.nh;
  const nouveauLieu = req.params.nl;
  const rep = req.params.rep;

  const maintenant = new Date();
  const heureActuelle = maintenant.getHours();
  const minuteActuelle = maintenant.getMinutes() + 1;

  notiff = cron.schedule(
    `${minuteActuelle} ${heureActuelle} * * *`,
    () => {
      console.log(
        `Changement d'horaire pour ${rep}  : ${nouvelHoraire}h, Nouveau lieu : ${nouveauLieu}`
      );
    },
    {
      scheduled: false,
    }
  );

  notiff.start();
};

//Changement autre que les répetitions
const envoyerNotificationChangementAutre = async (req, res) => {
  const { changement, message } = req.body;

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
