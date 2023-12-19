const Oeuvre = require("../models/oeuvre.js");

const addOeuvre = (req, res) => {
    Oeuvre.create(req.body)
      .then((oeuvre) => {
        res.status(201).json({
          model: oeuvre,
          message: "Oeuvre crée!",
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };

  module.exports = { addOeuvre };