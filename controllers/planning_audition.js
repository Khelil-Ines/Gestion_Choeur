const { model } = require("mongoose");
const Planning = require("../models/planning_audition");

const addPlanning = (req, res) => {
    Planning.create(req.body)
      .then((planning_audition) => {
        res.status(201).json({
          model: planning_audition,
          message: "Planning creé!",
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };
  
  const fetchplannings = (req, res) => {
    Planning.find()
      .then((plannings) => {
        res.status(200).json(plannings);
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  };
  
  module.exports = { addPlanning, fetchplannings };