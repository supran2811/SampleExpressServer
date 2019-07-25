
const express = require('express');

const pino = require('./utils/logger');

const expressPino = require('express-pino-logger')()

const expressHbs = require('express-handlebars');

const path = require('path');

const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const indexRoutes = require('./routes/index');
const errorController = require('./controllers/error');

const User = require('./models/user');

const connectMongo = require('./utils/database').connectMongo;

const app = express();

app.use(expressPino);

// app.engine('hbs',expressHbs({defaultLayout:''}));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req,res,next) => {
    User.findById('5d3115ed1c9d4400007d84a9').then(user => {
        req.user = new User(user.name , user.email , user.cart , user._id);
        next();
    }).catch(error => {
        pino.error('Error while retrieving user => '+error);
    })
})

/// This will enable to serve content statically to the public.
// So with below code the public folder datas could be accessed as a link.
app.use(express.static(path.join(__dirname, 'public')));

/// This is the middleware added to parse body otherwise req.body will always be undefined
app.use(bodyParser.urlencoded({ extended: false }));

/// We can add filter as the first parameter to use.
app.use('/admin', adminRouter);

app.use(shopRoutes);

app.use(indexRoutes);

/// This is for handling any routes which is not register
app.use(errorController.getInvalidPage);

connectMongo((error) => {
    if(!error) {
        app.listen(3000);
    }
    else {
        pino.error(error);
    }
})