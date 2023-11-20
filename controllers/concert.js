const Concert = require("../models/concert.js");

const addConcert = (req, res) => {
  Concert.create(req.body)
    .then((concert) => {
      res.status(201).json({
        model: concert,
        message: "Concert creé!",
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

const fetchConcert = (req, res) => {
  Audition.find()
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
          message: " Concert non supprimée!",
        });
      } else {
        res.status(200).json({
          model: concert,
          message: "Concert supprimée!",
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
};
