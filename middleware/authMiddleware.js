const jwt = require('jsonwebtoken');
const User = require('../model/User');

/**
 * une fonction intermédiaire qui permet de verifier si un token JWT existe et
 * si il est valide
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'secretTest123', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

/**
 * une fonction qui permet savoir si l'ultilisateur a bien un token valide
 * si oui on crée une variable local user qui contiendra L'ID du user.
 */
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secretTest123', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };