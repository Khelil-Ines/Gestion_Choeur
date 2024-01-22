const http = require("http")
const express = require('express');
const app = require("./app")
const cron = require('node-cron');
const socketIO = require('socket.io');
const Choriste = require("./models/choriste");
const port = process.env.PORT ||  5000
app.set("port" , port ) // non utilisable
const server = http.createServer(app)
const io = socketIO(server);
app.use(express.static('public'));
const {notifierAdmin} = require("./controllers/admin");
const {notifierAdminConges} = require('./controllers/admin');
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





app.use((req, res, next) => {
  req.io = io;
  next();
});


// Planifiez la tâche quotidienne à 10:00
cron.schedule('40 21 * * *', async () => {
  console.log('Exécution de la notification quotidienne à 10:00...');
  await notifierAdmin(io);
});



