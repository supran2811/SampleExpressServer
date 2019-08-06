const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transport = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  let msg = req.flash('error');
  if (msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: msg,
    validationErrors : [],
    oldInput:{
      email:'',
      password:''
    }
  });
};


exports.getReset = (req, res, next) => {
  let msg = req.flash('error');
  if (msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: msg
  });
};


exports.getSignup = (req, res, next) => {
  let msg = req.flash('error');
  if (msg.length > 0) {
    msg = msg[0];
  }
  else {
    msg = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: msg,
    oldInput: {
      email:'',
      password: '',
      confirmPassword : ''
    },
    validationErrors : []
  });
};

exports.getNewPassword = async (req, res , next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });
    if (user) {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Update Password',
        userid: user._id.toString(),
        errorMessage:''
      });
    }
    else {
      req.flash('error' , 'Token has expired or User does not exist anymore!!');
      res.redirect('/reset');
    }
  } catch (error) {
    next(error);
  }
}

exports.postLogin = async (req, res,next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;
    /// 422 is status code for validation fails.
    return  res.status(422).render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
    oldInput:{
      email,
      password
    },
    validationErrors : errors.array()
  });
  }
  
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
        req.flash('error', 'Invalid id or password');
        res.redirect('/login');
      }
    }
    else {
      req.flash('error', 'Invalid id or password');
      res.redirect('/login');
    }

  } catch (error) {
    next(error);
  }
}

exports.postSignup = async (req, res,next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  console.log("Validation Errors" , errors);
   if(!errors.isEmpty()) {
     const errorMessage = errors.array()[0].msg;
     /// 422 is status code for validation fails.
     return  res.status(422).render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage,
    oldInput:{
      email,
      password,
      confirmPassword
    },
    validationErrors : errors.array()
  });
   }
  try {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({
        email,
        password: hashedPassword,
        cart: {
          items: []
        }
      });
      await user.save();
      transport.sendMail({
        to: user.email,
        from: 'supran@sampleserver.com',
        subject: 'Signup suceeded',
        html: '<h1> You are signed up!! </h1>'
      })
      res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

exports.postReset = async (req, res,next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'User does not exist');
      return res.redirect('/reset');
    }
    const buff = await crypto.randomBytes(32);
    const token = buff.toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + (3600 * 1000);
    await user.save();
    transport.sendMail({
      to: user.email,
      from: 'supran@sampleserver.com',
      subject: 'Reset Password',
      html: `
          <p> Sending you the reset password link! </p>
          <p> Click <a href='http://localhost:3000/reset/${token}'>here</a> to reset.
        `
    });
    return res.redirect('/reset');
  } catch (err) {
    next(err);
  }
}

exports.updatePassword = async (req,res,next) => {
  try { 
    const { password , userid} = req.body;
    const user = await User.findOne({
      _id: userid
    });
    if(user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      await user.save();
      res.redirect('/login');
    }
    else {
      req.flash('error','User does not exist anymore!!')
      res.redirect('/signup');
    }
  } catch(error) {
    next(error);
  }
}

exports.postLogout = async (req, res,next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });

}