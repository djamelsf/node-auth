const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express()

// middleware
app.use(express.json())
app.use(cookieParser());

// View
app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://djam:BMt9g8zA5G3FkLIA@cluster0.js4hy.mongodb.net/testStrategIn?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'))
//app.get('/users', requireAuth, (req, res) => res.render('users'));

app.use(authRoutes)




