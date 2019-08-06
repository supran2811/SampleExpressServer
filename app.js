const path = require('path');

/// This is for express server
const express = require('express');

/// This is for parsing form body
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require('mongoose');
const multer = require('multer');
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const uniqid = require('uniqid');

const pino = require('./utils/logger');
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

app.use(bodyParser.urlencoded({ extended: false }));

const  storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uniqid()+'-'+file.originalname);
  }
});

const fileFilter = (req, { mimetype }, cb) => {
      cb(null , (mimetype === 'image/jpeg' || mimetype === 'image/jpg'|| mimetype === 'image/png'));
}
 
app.use(multer({storage,fileFilter}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

const store = new MongoDbStore({
  uri: MONGODB_URI,
  databaseName: 'shop',
  collection: 'sessions'
});

app.use(session({ secret: 'My secret key', resave: false, saveUninitialized: false, store }));
app.use(csrf());
app.use(flash());

app.use(async (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  try {
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      if(user) {
         req.user = user;
      }
    }
    next();
  } catch(error) {
     ////Throwing a error here wont work since its asynchronous code
    /// So we need to call next with error.
    /// Important: Throwing error from synchronous code does work without using next
    next(error);
  }
  
});

app.use('/admin', adminRoutes);
app.use(indexRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/error', errorController.getErrorPage);

app.use(errorController.getInvalidPage);

//// This is a global middleware given by express to handle any error in the 
/// The entire application stack.
/// This also get executed in sequence from top to downward.
app.use((error, req, res, next) => {
  pino.error(error);
  res.redirect('/error');
})

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    pino.error(err);
  });
