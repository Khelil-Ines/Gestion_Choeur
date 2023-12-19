const express = require("express");
const mongoose = require("mongoose");


const app = express();
const auditionRouter = require('./routes/audition');
const CandidatRoutes=require("./routes/candidat")
const compositeurRoutes=require("./routes/compositeur")
const oeuvreRoutes=require("./routes/oeuvre")
const chef_router=require("./routes/chef_pupitre")
const choristeRouter = require('./routes/choriste.js');
const absenceRouter = require('./routes/absence.js');
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content,Accept,Content-Type,Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS"
    );
    next();
  });

  mongoose.connect("mongodb://127.0.0.1:27017/Gestion_Choeur",{
    useNewUrlParser: true , useUnifiedTopology:true }
  ).then(() => console.log("connexion a MongoDB reussie!"))
 .catch((e) => console.log("connexion a MongoDB échouée!",e))


app.use('/audition', auditionRouter);
app.use("/candidats", CandidatRoutes);
app.use("/api/Compositeur", compositeurRoutes);
app.use("/api/Oeuvre", oeuvreRoutes);
app.use("/Add_Chef", chef_router);
app.use('/choriste', choristeRouter);
app.use('/absence', absenceRouter);
module.exports = app;