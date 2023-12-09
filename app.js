const express = require("express");
const mongoose = require("mongoose");
//sur mongo local
mongoose
  .connect("mongodb://localhost:27017/Gestion_Choeur", )
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!", e));

const app = express();
app.use(express.json()); 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Heders",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});



module.exports = app;