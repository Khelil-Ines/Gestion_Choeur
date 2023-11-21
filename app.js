
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const concertRouter = require('./routers/concert');
const oeuvreRouter = require('./routers/oeuvre');
const programmeRouter = require('./routers/programme');

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
app.use('/concert', concertRouter);
app.use('/oeuvre', oeuvreRouter);
app.use('/programme', programmeRouter);

module.exports = app;

