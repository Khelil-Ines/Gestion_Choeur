const http = require("http")
const express = require('express');
const app = require("./app")
const cron = require('node-cron');
const socketIO = require('socket.io');
const Choriste = require("./models/choriste");
const ChefPupitre = require("./models/chef_pupitre");
const port = process.env.PORT ||  5000
app.set("port" , port ) // non utilisable
const server = http.createServer(app)
const io = socketIO(server);
app.use(express.static('public'));
const {notifierAdmin} = require("./controllers/admin");
server.listen(port , () => {
    console.log("listening on" + port)
})


const notifications = [];
const choristesSockets = {};

io.on('connection', (socket) => {
  console.log('Client connecté');

  // Envoyer les notifications existantes lorsqu'un client se connecte
  socket.emit('notificationList', notifications);

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

// Planifiez la tâche quotidienne à 10:00
cron.schedule('* 10 * * *', async () => {
  console.log('Exécution de la notification quotidienne à 10:00...');
  await notifierAdmin(io);
});

// Ajouter le code pour la gestion des choristes
io.on('connection', (socket) => {
  console.log('Clie nt connecté');

  // Envoyer les notifications existantes lorsqu'un client se connecte
  socket.emit('notificationList', notifications);

  socket.on('choristeConnect', (choristeId) => {
    console.log(`Choriste connecté : ${choristeId}`);
    // Enregistrez le socket associé à ce choriste
    choristesSockets[choristeId] = socket;
  });

  // // Écouter l'événement 'congeAjoute' émis par le côté client du choriste
  // socket.on('congeAjoute', async ({ choristeId, conge }) => {
  //   console.log(`Congé ajouté par le choriste : ${choristeId}`);
    
  //   // Récupérez la pupitre du choriste
  //   const choriste = await Choriste.findById(choristeId);
  //   const pupitre = choriste.pupitre;

  //   // Récupérez les chefs de pupitre de cette pupitre
  //   const chefsDePupitre = await ChefPupitre.find({ pupitre });

  //   // Notifiez les chefs de pupitre de ce congé
  //   chefsDePupitre.forEach(chef => {
  //     const chefSocket = choristesSockets[chef._id];
  //     if (chefSocket) {
  //       chefSocket.emit('notificationCongeAjoute', { choristeId, conge });
  //     }
  //   });
  // });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
    // Gérer la déconnexion d'un choriste et le retirer de la liste des sockets choristes
    const choristeId = Object.keys(choristesSockets).find(key => choristesSockets[key] === socket);
    if (choristeId) {
      delete choristesSockets[choristeId];
      console.log(`Choriste déconnecté : ${choristeId}`);
    }
  });
});

