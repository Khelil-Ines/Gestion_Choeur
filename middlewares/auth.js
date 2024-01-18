const jwt = require("jsonwebtoken");
const Compte = require("../models/compte");
const Choriste = require ("../models/choriste");
const Chef_Pupitre = require("../models/chef_pupitre");
const Admin = require("../models/admin");
const Candidat = require("../models/candidat");

// module.exports.verifyToken = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

//     const choristeId = decodedToken.choristeId;
    
//     // Utilisation de async/await pour rendre la recherche de l'utilisateur plus propre
//     const userModel = await UserModels.findOne({ _id: choristeId });

//     if (!userModel) {
//       return res.status(404).json({
//         message: 'User non trouvé!',
//       });
//     }

//     // Ajout des données d'authentification à req.auth
//     req.auth = {
//       choristeId: choristeId,
//       role: userModel.role,
//     };

//     next();
//   } catch (error) {
//     return res.status(401).json({ error: error.message });
//   }
//};




module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const compteId = decodedToken.compteId;

    Compte.findOne({ _id: compteId })
    .then((compte) => {
       if (!compte) {
          return res.status(401).json({ message: "login ou mot de passe incorrecte " });
       } else {
          req.auth = {
             compteId: compteId,
             role: compte.role,
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


module.exports.isChoriste = async (req, res, next) => {
try{
  const choriste = await Choriste.findOne({ compte: req.auth.compteId });
console.log(choriste)

    if(choriste)
    {
      next();}
      else {
        res.status(403).json({ error:"Il faut etre choriste pour avoir acces a cette route" });
      } 
}
catch(error)
{
  res.status(401).json({ error:error.message });
}
};

module.exports.isChefPupitre = async (req, res, next) => {
  try{
    const chefPupitre = await Chef_Pupitre.findOne({ compte: req.auth.compteId });
  console.log(chefPupitre)
  
      if(chefPupitre)
      {
        next();}
        else {
          res.status(403).json({ error:"Il faut etre chef de pupitre pour avoir acces a cette route" });
        } 
  }
  catch(error)
  {
    res.status(401).json({ error:error.message });
  }
  };

  module.exports.isAdmin = async (req, res, next) => {
    try{
      const admin = await Admin.findOne({ compte: req.auth.compteId });
    console.log(admin)
    
        if(admin)
        {
          next();}
          else {
            res.status(403).json({ error:"Il faut etre admin pour avoir acces a cette route" });
          } 
    }
    catch(error)
    {
      res.status(401).json({ error:error.message });
    }
    };


