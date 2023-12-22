const Concert = require("../models/concert.js");
const crypto = require('crypto');

const addConcert = (req, res) => {
  // Get and validate concert date
  const concertDateString = req.body.date;
  const randomLink = crypto.randomBytes(5).toString('hex');
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(concertDateString)) {
    return res
      .status(400)
      .send("Invalid concert date format. Please use YYYY-MM-DD format.");
  }

  const concertDate = new Date(concertDateString);

  const moment = require("moment");

  const dateString = req.body.date;
  const dateObject = moment(dateString, "YYYY-MM-DD", true).toDate();
  if (moment(dateObject).isValid()) {
    // The date is valid
    console.log('Parsed Date:', dateObject);
  } else {
    // The date is invalid
    console.error('Invalid Date Format');
  }
  Concert.create({ ...req.body, date: dateObject , link: randomLink,})

    .then((concert) => res.status(201).json({
      model: concert,
      message: "Concert crée!",
    }))
    .catch((error) => {
      if (error.errors) {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ errors });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    });
};





const fetchConcert = (req, res) => {
  Concert.find().populate("programme")
    .then((concerts) => {
      res.status(200).json(concerts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

const updateConcert = (req, res) => {
  Concert.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true }
  )
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: "Concert non trouvé",
        });
      } else {
        res.status(200).json({
          model: concert,
          message: "Concert modifié",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

const deleteConcert = (req, res) => {
  Concert.deleteOne({ _id: req.params.id })
    .then((concert) => {
      if (!concert) {
        res.status(404).json({
          message: " Concert non supprimé!",
        });
      } else {
        res.status(200).json({
          model: concert,
          message: "Concert supprimé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = {
  addConcert,
  fetchConcert,
  updateConcert,
  deleteConcert,
}







