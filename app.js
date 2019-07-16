
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

const sequelize = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');
const Order = require('./models/order');

const app = express();

app.use(expressPino);

// app.engine('hbs',expressHbs({defaultLayout:''}));

app.set("view engine", "ejs");
app.set("views", "views");

/// This will enable to serve content statically to the public.
// So with below code the public folder datas could be accessed as a link.
app.use(express.static(path.join(__dirname, 'public')));

/// This is the middleware added to parse body otherwise req.body will always be undefined
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(error => {
        pino.error(error);
    });
});

/// We can add filter as the first parameter to use.
app.use('/admin', adminRouter);

app.use(shopRoutes);

app.use(indexRoutes);

/// This is for handling any routes which is not register
app.use(errorController.getInvalidPage);

//// Setting the associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , { through : OrderItem });

/// Starting the server after databases are in sync
sequelize.sync().then(result => {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({
            name: 'Supran',
            email: 'supran@email.com'
        })
    }
    return user;
}).then(user => {
        return user.createCart();
}).then(() => {
        app.listen(3000);
}).catch(error => {
        pino.error(error);
});
