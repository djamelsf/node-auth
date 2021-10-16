const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

/**
 * le Schema de l'utilistaeur 
 * avec certaines contraintes de création
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Veuillez entrer une adresse email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Veuillez entrer une adresse email valide']
  },
  password: {
    type: String,
    required: [true, 'Veuillez entrer un mot de passe'],
    minlength: [6, 'veuillez entrer un mot de passe à 6 caractères au minimum'],
  }
})

/**
 * Une fonction qui sera appelé juste avant la création d'un utilisateur
 * elle permet de hasher son mot de passe afin de le stocker chifré dans la DB
 */
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// static method to login user
/**
 * une fonction (methode) statique qui permet verfier si (email,password)
 * existe dans notre DB 
 * si oui elle renovie un User
 * sinon elle renvoie une erreur
 */
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Mot de passe invalide');
  }
  throw Error('email invalide');
};

const User = mongoose.model('user', userSchema)

module.exports = User