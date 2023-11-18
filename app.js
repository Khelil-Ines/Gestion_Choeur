
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const auditionRouter = require('./routers/audition');
const planning_auditionRouter = require('./routers/planning_audition');

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
app.use('/planning_audition', planning_auditionRouter);
module.exports = app;

