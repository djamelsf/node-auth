const User = require("../model/User")
const jwt = require('jsonwebtoken')


// une fonction qui gere les erreurs
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };


  if (err.message === 'email invalide') {
    errors.email = 'email non existant';
  }

  
  if (err.message === 'Mot de passe invalide') {
    errors.password = 'Mot de passe invalide';
  }


  if (err.code === 11000) {
    errors.email = 'cette adresse email existe dèja';
    return errors;
  }
  // errors contient properties qui contient path et message
  // validation errors
  if (err.message.includes('user validation failed')) {
    //console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


/**
 * Création d'un token JWT
 */
const maxAge = 2 * 24 * 60 * 60; // 2 Jours.
const createToken = (id) => {
  return jwt.sign({ id }, 'secretTest123', {
    expiresIn: maxAge
  });
};




///////////////////////////////////////////////////////////////////////// controllers///////////////////////////////////////////////////////
/**
 * la fonction qui renovie vers la page /users avec la liste des users.
 */
module.exports.users_get = (req, res) => {

  User.find((err, users) => {
    if (!err)
      res.render('users', { 'users': users });
    else
      console.log(JSON.stringify(err));
  });
}

/**
 * la fonction qui renovie vers la page /register.
 */
module.exports.register_get = (req, res) => {
  res.render('register');
}

/**
 * la fonction qui renovie vers la page /login.
 */
module.exports.login_get = (req, res) => {
  res.render('login');
}
/**
 * la fonction qui permet de créer un utilisateur dans la base de données
 * ensuite elle crée un token qui sera enregistré d'un cookie avec une durée limitée
 */
module.exports.register_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    //console.log(err);
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}
/**
 * une fonction qui appelle la fonction login du model User afin de verifier si l'utilistaeur 
 * peut s'authentifier
 * ensuite création du token JWT
 */
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

/**
 * une fonction qui permet la déconnexion de l'utilisateur
 * elle modifie le contenu du cookie et sa durée en 1 sec
 * donc le cookie sera supprimé rapidement.
 * donc déconnexion
 */
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}