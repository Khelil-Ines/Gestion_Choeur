const express = require("express");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://testb8835:pEgxGH7MaUleOFlx@cluster0.ogaz79o.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!", e));

const app = express();
const auditionRouter = require("./routes/audition");
const compositeurRoutes = require("./routes/compositeur");
const oeuvreRoutes = require("./routes/oeuvre");
const chef_router = require("./routes/chef_pupitre");
const choristeRouter = require("./routes/choriste.js");
const absenceRouter = require("./routes/absence.js");
const candidatRouter = require("./routes/candidat");
const repetitionRouter = require("./routes/repetition");
const compteRouter = require("./routes/compte");
const congeRouter = require("./routes/conge");
const ConcertRouter = require("./routes/concert");
const SaisonRouter = require("./routes/saison.js");

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

app.use((req, res, next) => {
  console.log("Requête reçue:", req.method, req.url, req.body);
  next();
});

app.use("/api/Compositeur", compositeurRoutes);
app.use("/api/Oeuvre", oeuvreRoutes);
app.use("/Add_Chef", chef_router);
app.use("/absence", absenceRouter);
app.use("/api/choriste", choristeRouter);
app.use("/api/candidat", candidatRouter);
app.use("/api/audition", auditionRouter);
app.use("/api/repetition", repetitionRouter);
app.use("/api/compte", compteRouter);
app.use("/api/conge", congeRouter);
app.use("/api/concert", ConcertRouter);
app.use("/api/saison", SaisonRouter);

module.exports = app;
