const path = require('path');
const fs = require('fs');

/// This is for express server
const express = require('express');
const https = require('https');

/// This is for parsing form body
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require('mongoose');
const multer = require('multer');
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const uniqid = require('uniqid');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const pino = require('./utils/logger');
const errorController = require('./controllers/error');

const shopController = require('./controllers/shop');

const isAuth = require('./middleware/is-auth');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@supran-cluster0-zzni5.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`

app.use(helmet());
app.use(compression());

// const privateKey = fs.readFileSync(path.join(__dirname , 'server.key'));
// const serverCert = fs.readFileSync(path.join(__dirname , 'server.cert'));

const accessStream = fs.createWriteStream(path.join(__dirname , "access.log") , {flags:'a'});

app.use(morgan('combined' , { stream: accessStream}));

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
  databaseName: process.env.MONDO_DBNAME,
  collection: 'sessions'
});

app.use(session({ secret: 'My secret key', resave: false, saveUninitialized: false, store }));

app.use(flash());

app.use(async (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
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

/// In order to avoid csrf token check for this route we 
/// need to handle this route before csrf token is used
app.post('/create-order' , isAuth,shopController.doCreateOrder);

app.use(csrf());

app.use( (req,res,next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
})
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
    // https.createServer( { key:privateKey , cert:serverCert } , app )
    // .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    pino.error(err);
  });
