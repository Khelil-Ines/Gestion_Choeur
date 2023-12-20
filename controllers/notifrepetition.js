const cron = require("node-cron");
const choriste = require("../models/choriste");

let notif;

const envoyerNotification = (req, res) => {
  const repetitions = req.params.repetitions;
  
  if (notif) {
    notif.stop();
  }

  let count = 0;
  notif = cron.schedule(
    "* * * * * *",
    () => {
      count++;
      console.log(
        `Rappelez-vous ! vous avez une répétition le ..... (fois ${count}/${repetitions})`
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
  envoyerNotification
};
