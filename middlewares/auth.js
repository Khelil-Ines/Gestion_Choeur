const jwt = require("jsonwebtoken")
const Choriste = require("../models/choriste")

module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const choristeId = decodedToken.choristeId;

    Choriste.findOne({ _id: choristeId })
    .then((choriste) => {
       if (!choriste) {
          return res.status(401).json({ message: "login ou mot de passe incorrecte " });
       } else {
          req.auth = {
             choristeId: choristeId,
             role: choriste.role,
          };
          next();
       }
    })
    .catch((error) => {
       res.status(500).json({ error: error.message });
    });
 
  } catch (error) {
    res.status(401).json({ error });
  }
};