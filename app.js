
const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

/// We can add filter as the first parameter to use.
app.use('/admin',adminRoutes);

app.use(shopRoutes);

/// This is for handling any routes which is not register
app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname , 'views' , '404.html'));
})

app.listen(3000);
