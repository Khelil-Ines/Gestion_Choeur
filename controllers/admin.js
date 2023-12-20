const moment = require('moment-timezone');
const Candidat = require('../models/candidat');

const notifierAdmin = async (io) => {
  try {
    console.log("hello")
    const timeZone = 'Europe/Paris';
    const currentDate = moment().tz(timeZone);
    const yesterdayTenAM = moment().subtract(1, 'days').set({ hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }).tz(timeZone);
    const todayTenAM = moment().set({ hours: 12, minutes: 30, seconds: 0, milliseconds: 0 }).tz(timeZone);

    // Recherchez les candidats créés entre hier 10h00 et aujourd'hui 10h00
    const newCandidats = await Candidat.find({
      createdAt: { $gte: yesterdayTenAM.toDate(), $lt: todayTenAM.toDate() },
    }).lean();

    console.log('Nouveaux candidats depuis hier 10h00 jusqu\'à aujourd\'hui 10h00 :');

    // Afficher chaque candidature
    newCandidats.forEach(candidat => {
      console.log(`ID: ${candidat._id}, Nom: ${candidat.nom}, Prénom: ${candidat.prénom}, ...`); // Ajoutez d'autres champs si nécessaire
    });
    
    if (newCandidats.length > 0) {
      // Émettez une notification ou faites ce que vous devez faire avec les nouvelles candidatures
      io.emit('notification', { message: `Nouveaux candidats ajoutés le ${currentDate.format('DD/MM/YYYY HH:mm:ss')}` });
    } else {
      console.log('Aucun nouveau candidat depuis la dernière notification');
    }
  } catch (error) {
    console.error('Erreur lors de la notification de l\'administrateur :', error.message);
  }
};

module.exports = { notifierAdmin };
