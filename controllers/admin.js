const moment = require('moment-timezone');
const Candidat = require('../models/candidat');
const Admin = require('../models/admin');
const Utilisateur = require('../models/utilisateur'); 
const Notification = require('../models/notification');

const addAdmin = (req, res) => {
  const admin = new Admin(req.body);
  saved = admin
    .save()
    .then(() => {
      return res.status(201).json({
        models: admin,
        message: "object cree!",
      });
      Utilisateur.Admin = saved;
    })
    .catch((error) => {
      
     return res.status(400).json({
        error: error.message,
        message: "Donnee invalides",
      });
    });
};

const notifierAdmin = async (io) => {
  try {
    console.log("hello")
    const timeZone = 'Europe/Paris';
    const currentDate = moment().tz(timeZone);
    const yesterdayTenAM = moment().subtract(1, 'days').set({ hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }).tz(timeZone);
    const todayTenAM = moment().set({ hours: 13, minutes: 30, seconds: 0, milliseconds: 0 }).tz(timeZone);

    // Recherchez les candidats créés entre hier 10h00 et aujourd'hui 10h00
    const newCandidats = await Candidat.find({
      createdAt: { $gte: yesterdayTenAM.toDate(), $lt: todayTenAM.toDate() },
    }).lean();

    console.log('Nouveaux candidats depuis hier 10h00 jusqu\'à aujourd\'hui 10h00 :');

    // Afficher chaque candidature

    newCandidats.forEach(candidat => {
      console.log(`ID: ${candidat._id}, Nom: ${candidat.nom}, Prénom: ${candidat.prénom}, ...`); // Ajoutez d'autres champs si nécessaire

      // Émettre une notification avec les coordonnées du nouveau candidat
      io.emit('notification', {
        message: ` le nouveau candidat :  Nom: ${candidat.nom}, Prénom: ${candidat.prénom}`,
        candidature: candidat, // Envoyer les coordonnées du candidat
      });
    });
    
    if (newCandidats.length > 0) {
      // Émettez une notification ou faites ce que vous devez faire avec les nouvelles candidatures
    
    } else {
      console.log('Aucun nouveau candidat depuis la dernière notification');
    }
  } catch (error) {
    console.error('Erreur lors de la notification de l\'administrateur :', error.message);
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.auth.compteId; 
    console.log(adminId);

    const admin = await Admin.findOne({ compte: adminId }).populate('notifications');
    console.log(admin);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const notifications = admin.notifications;

    // Récupérer uniquement les détails pertinents de chaque notification
    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      message: notification.message,
      createdAt: notification.createdAt,
    }));

    res.status(200).json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications de l\'administrateur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications de l\'administrateur.' });
  }
};

module.exports = { notifierAdmin, addAdmin, getAdminNotifications };
