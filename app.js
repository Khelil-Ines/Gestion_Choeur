const express = require('express');
const app = express();
const mongoose = require('mongoose');
const choristeRouter = require("./routes/choriste");
const pupitreRouter = require("./routes/pupitre");
const candidatRouter = require("./routes/candidat");
const auditionRouter = require("./routes/audition");



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(express.json());

//sur mongo local
mongoose.connect("mongodb://127.0.0.1:27017/Choeur")
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!",e))

app.use("/api/choriste", choristeRouter)
app.use("/api/pupitre", pupitreRouter)
app.use("/api/candidat", candidatRouter)
app.use("/api/audition", auditionRouter)

module.exports = app;