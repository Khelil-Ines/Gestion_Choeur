
const express = require("express");
const mongoose = require("mongoose");
const http = require("http")
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = socketIO(server);
const auditionRouter = require('./routes/audition');
const compositeurRoutes=require("./routes/compositeur")
const oeuvreRoutes=require("./routes/oeuvre")
const chef_router=require("./routes/chef_pupitre")
const choristeRouter = require('./routes/choriste.js');
const absenceRouter = require('./routes/absence.js');
const candidatRouter = require("./routes/candidat");
const repetitionRouter = require("./routes/repetition");
const compteRouter = require("./routes/compte");
const congeRouter = require("./routes/conge");
const ConcertRouter= require("./routes/concert");




app.use(express.json());

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});
app.use('/notif', (req, res) => {
  res.send('OK'); // Réponse simple pour indiquer que la route est accessible
});

mongoose.connect("mongodb+srv://testb8835:pEgxGH7MaUleOFlx@cluster0.ogaz79o.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser : true, useUnifiedTopology: true } )
       .then(() => console.log("Connexion a MongoDB réussie !"))
       .catch((e) => console.log("Connexion a MongoDB échouée!", e ))

app.use((req, res, next) => {
  console.log('Requête reçue:', req.method, req.url, req.body);
  next();
});
 


app.use('/notif', (req, res) => {
  res.send('OK'); // Réponse simple pour indiquer que la route est accessible
});

// Configurations Socket.IO
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  // Gestionnaire d'événements pour le login du chef de pupitre
  socket.on('loginChefPupitre', (pupitre) => {
    console.log(`Le chef de pupitre du ${pupitre} s'est connecté`);
    socket.join(pupitre); // Joindre une "room" correspondant au pupitre
  });

  // Gestionnaire d'événements pour l'envoi de notifications de modification
  socket.on('envoyerNotificationModification', (data) => {
    console.log('Notification de modification envoyée :', data);
    io.to(data.pupitre).emit('modificationNotification', { message: data.message });
  });

  // Gestionnaire d'événements pour la déconnexion du client
  socket.on('disconnect', () => {
    console.log('Un client s est déconnecté');
  });
});



app.use("/api/Compositeur", compositeurRoutes);
app.use("/api/Oeuvre", oeuvreRoutes);
app.use("/Add_Chef", chef_router);
app.use('/absence', absenceRouter);
app.use("/api/choriste", choristeRouter)
app.use("/api/candidat", candidatRouter)
app.use("/api/audition", auditionRouter)
app.use("/api/repetition", repetitionRouter)
app.use("/api/compte", compteRouter)
app.use("/api/conge", congeRouter)
app.use("/api/concert", ConcertRouter);

module.exports = app;