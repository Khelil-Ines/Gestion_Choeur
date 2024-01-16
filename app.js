const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const auditionRouter = require("./routes/audition");
const CandidatRoutes = require("./routes/candidat");
const compositeurRoutes = require("./routes/compositeur");
const oeuvreRoutes = require("./routes/oeuvre");
const chef_router = require("./routes/chef_pupitre");
const choristeRouter = require("./routes/choriste.js");
const absenceRouter = require("./routes/absence.js");
const repetitionRouter = require("./routes/repetition");
const compteRouter = require("./routes/compte");
const congeRouter = require("./routes/conge");
const SaisonRouter = require("./routes/saison.js");
const notifrepetition = require("./routes/notifrepetition.js");
const ConcertRouter = require("./routes/concert");
const mailRouter = require("./routes/validermail.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Choir management API with swagger by Ines,Aya,Aasma,Ghofrane",
      version: "0.1.0",
      description: "This is a choir management API application",
      contact: {
        name: "Ines,Aya,Asma,Ghofrane",
        email: "testb8835@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      responses: {
        200: {
          description: "Success",
        },
        400: {
          description: "Bad request. You may need to verify your information.",
        },
        401: {
          description: "Unauthorized request, you need additional privileges",
        },
        403: {
          description:
            "Forbidden request, you must login first. See /auth/login",
        },
        404: {
          description: "Object not found",
        },
        422: {
          description:
            "Unprocessable entry error, the request is valid but the server refused to process it",
        },
        500: {
          description: "Unexpected error, maybe try again later",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://testb8835:pEgxGH7MaUleOFlx@cluster0.ogaz79o.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!", e));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  next();
});
app.use("/notif", (req, res) => {
  res.send("OK"); // Réponse simple pour indiquer que la route est accessible
});

app.use((req, res, next) => {
  console.log("Requête reçue:", req.method, req.url, req.body);
  next();
});

app.use("/notif", (req, res) => {
  res.send("OK"); // Réponse simple pour indiquer que la route est accessible
});

// Configurations Socket.IO
io.on("connection", (socket) => {
  console.log("Un client est connecté");

  // Gestionnaire d'événements pour le login du chef de pupitre
  socket.on("loginChefPupitre", (pupitre) => {
    console.log(`Le chef de pupitre du ${pupitre} s'est connecté`);
    socket.join(pupitre); // Joindre une "room" correspondant au pupitre
  });

  // Gestionnaire d'événements pour l'envoi de notifications de modification
  socket.on("envoyerNotificationModification", (data) => {
    console.log("Notification de modification envoyée :", data);
    io.to(data.pupitre).emit("modificationNotification", {
      message: data.message,
    });
  });

  // Gestionnaire d'événements pour la déconnexion du client
  socket.on("disconnect", () => {
    console.log("Un client s est déconnecté");
  });
});

app.use("/audition", auditionRouter);
app.use("/candidats", CandidatRoutes);
app.use("/api/Compositeur", compositeurRoutes);
app.use("/api/Oeuvre", oeuvreRoutes);
app.use("/Chef_pupitre", chef_router);
app.use("/absence", absenceRouter);
app.use("/api/choriste", choristeRouter);
app.use("/api/candidat", CandidatRoutes);
app.use("/api/compte", compteRouter);
app.use("/api/repetition", repetitionRouter);
app.use("/api/conge", congeRouter);
app.use("/api/notifrep", notifrepetition);
app.use("/api/concert", ConcertRouter);
app.use("/api/saison", SaisonRouter);
app.use("/api/validermail", mailRouter);

module.exports = app;
