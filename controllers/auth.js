const bcrypt = require('bcrypt');
const pino = require('../utils/logger');
const User = require('../models/user');
exports.getLogin = (req, res, next) => {
  let msg = req.flash('error');
  if(msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage : msg
  });
};


exports.getSignup = (req, res, next) => {
  let msg = req.flash('error');
  if(msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage : msg
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const doMatch = await bcrypt.compare(password, user.password);
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          if (!err) {
            res.redirect('/');
          }
          else {
            res.redirect('/login');
          }
        })
      }
      else {
        req.flash('error','Invalid id or password');
        res.redirect('/login');
      }
    }
    else {
      req.flash('error','Invalid id or password');
      res.redirect('/login');
    }

  } catch (error) {
    pino.error(error);
    res.redirect('/login');
  }
}

exports.postSignup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error','User already exist!');
      res.redirect('/signup');
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({
        email,
        password: hashedPassword,
        cart: {
          items: []
        }
      });
      await user.save();
      res.redirect('/login');
    }
  } catch (err) {
    pino.error(err);
  }
};

exports.postLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      pino.error(err);
    }
    res.redirect("/");
  });

}