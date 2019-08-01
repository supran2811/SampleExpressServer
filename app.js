const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require('mongoose');
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/shop?retryWrites=true&w=majority'

const store = new MongoDbStore({
  uri: MONGODB_URI,
  databaseName: 'shop',
  collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'My secret key', resave: false, saveUninitialized: false, store }));
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  }
  else {
    next();
  }

});

app.use((req,res,next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(indexRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getInvalidPage);

mongoose
  .connect(
  MONGODB_URI
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
