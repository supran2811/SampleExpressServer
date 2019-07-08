
const express = require('express');

const expressHbs = require('express-handlebars');

const path = require('path');

const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const indexRoutes = require('./routes/index');
const errorController = require('./controllers/error');

const app = express();

// app.engine('hbs',expressHbs({defaultLayout:''}));

app.set("view engine" , "ejs");
app.set("views" , "views");

/// This will enable to serve content statically to the public.
// So with below code the public folder datas could be accessed as a link.
app.use(express.static(path.join(__dirname , 'public')));

/// This is the middleware added to parse body otherwise req.body will always be undefined
app.use(bodyParser.urlencoded({extended:false}));

/// We can add filter as the first parameter to use.
app.use('/admin',adminRouter);

app.use(shopRoutes);

app.use(indexRoutes);

/// This is for handling any routes which is not register
app.use(errorController.getInvalidPage);

app.listen(3000);
