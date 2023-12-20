const http = require("http")
const express = require('express');
const app = require("./app")
const cron = require('node-cron');
const socketIO = require('socket.io');
const port = process.env.PORT ||  3000
app.set("port" , port ) // non utilisable
const server = http.createServer(app)
const io = socketIO(server);
app.use(express.static('public'));
const {notifierAdmin} = require("./controllers/admin");
server.listen(port , () => {
    console.log("listening on" + port)
})

const notifications = [];

io.on('connection', (socket) => {
  console.log('Client connecté');

  // Envoyer les notifications existantes lorsqu'un client se connecte
  socket.emit('notificationList', notifications);

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

// Planifiez la tâche quotidienne à 10:00
cron.schedule('0 10 * * *', async () => {
  console.log('Exécution de la notification quotidienne à 10:00...');
  await notifierAdmin(io);
});