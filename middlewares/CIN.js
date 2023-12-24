exports.validateCIN = (req, res, next) => {
    const cin = req.body.CIN;
  
    if (!cin || !/^\d{8}$/.test(cin)) {
      return res.status(400).json({ error: 'Format CIN Invalide. Il faut exactement 8 chiffres.' });
    }
  
    next();
  };

