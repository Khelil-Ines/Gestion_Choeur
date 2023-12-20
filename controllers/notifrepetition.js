const cron = require("node-cron");
const choriste = require("../models/choriste");


const envoyerNotification = (req, res) => {
  let count = 0;
  const repetitions = req.params.repetitions;
  let notif = cron.schedule(
    "* * * * * *",
    () => {
      count++;
      console.log(
        `Rappelez-vous ! vous avez une répétition le ..... (fois ${count}/${repetitions})`
      );
      if (count === repetitions) {
        notif.stop(); // Arrête la tâche une fois que le nombre de répétitions est atteint
        count = 0;
      }
    },
    {
      scheduled: false, // Empêche l'exécution immédiate de la tâche après la planification
    }
  );
  notif.start();
};

module.exports = {
  envoyerNotification,
};
