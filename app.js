const express = require("express");

const mongoose = require("mongoose");
const CandidatRoutes=require("./routes/candidat")
const PlanningRoutes=require("./routes/audition")
//sur mongo local
mongoose
  .connect("mongodb://localhost:27017/Gestion_Choeur", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!", e));

const app = express();
app.use(express.json()); //pour que les données de post se mettent dans le body et va afficher le contenu de body sous forme json
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
  console.log('Requête reçue:', req.method, req.url, req.body);
  next();
});



app.use("/candidats", CandidatRoutes);
app.use("/planning", PlanningRoutes);
module.exports = app;