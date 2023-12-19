const http = require("http")
const express = require('express');
const app = require("./app")
const socketIO = require('socket.io');
const port = process.env.PORT ||  3000
app.set("port" , port ) // non utilisable
const server = http.createServer(app)
const io = socketIO(server);
app.use(express.static('public'));

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

// Simuler l'ajout de nouvelles candidatures tous les jours à 10h
setInterval(() => {
  const currentDate = new Date();
  if (currentDate.getHours() === 21 && currentDate.getMinutes() === 15) {
    const newNotification = `Nouvelles candidatures ajoutées le ${currentDate.toLocaleString()}`;
    notifications.push(newNotification);
    io.emit('notification', newNotification);
  }
}, 60000); 
