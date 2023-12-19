const cron = require('node-cron');
const Candidat = require("../models/candidat");
const moment = require('moment-timezone');

const notifierAdmin = async () => {
  try {
    const timeZone = 'Europe/Paris'; // Spécifiez le fuseau horaire
    const currentDate = moment().tz(timeZone);
    const yesterdayTenPM = moment().subtract(1, 'days').set({ hours: 21, minutes: 15, seconds: 0, milliseconds: 0 }).tz(timeZone);
    const todayTenPM = moment().set({ hours: 22, minutes: 10, seconds: 0, milliseconds: 0 }).tz(timeZone);

    // Recherchez les nouvelles candidatures ajoutées entre hier 21h15 et aujourd'hui 21h15
    const newCandidats = await Candidat.find({
      createdAt: { $gte: yesterdayTenPM.toDate(), $lt: todayTenPM.toDate() },
    });

    console.log('Nouvelles candidatures ajoutées :', newCandidats);
    
    if (newCandidats.length > 0) {
      // Émettez une notification ou faites ce que vous devez faire avec les nouvelles candidatures
      io.emit('notification', { message: `Nouvelles candidatures ajoutées le ${currentDate.format('DD/MM/YYYY HH:mm:ss')}` });
    } else {
      console.log('Aucune nouvelle candidature depuis la dernière notification');
    }

    lastCronRun = currentDate;
  } catch (error) {
    console.error('Erreur lors de la notification de l\'administrateur :', error.message);
  }
};

// Planification de la tâche quotidienne à 21:00
cron.schedule('0 21 * * *', async () => {
  console.log('Exécution de la notification quotidienne à 21:00...');
  await notifierAdmin();
});


module.exports = {
    notifierAdmin: notifierAdmin,
  };