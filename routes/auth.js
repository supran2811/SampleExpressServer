const express = require('express');

const authController = require('../controllers/auth');
const User = require('../models/user');

const { check , body } = require('express-validator/check');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid mail').custom((value,req) => {
        if(value.indexOf('@test.com') > 0) {
            throw new Error('This email is fobidden!!');
        }
        else return true;
    }), 
    body('password','Enter password of min 5 and without any special character.')
    .isLength({ min: 5 })
    .isAlphanumeric()], authController.postLogin);

router.post('/logout' , authController.postLogout);

router.post('/signup', 
    [check('email')
    .isEmail()
    .withMessage('Please Enter valid email')
    .custom((value,{req}) => {
        if(value.indexOf('@test.com') > 0) {
            throw new Error('This email is fobidden!!');
        }
        else return true;

    })
    .custom( (value , { req }) => {
        return User.findOne({ email : value }).then(user => {
            if(user) {
                return Promise.reject('User already exist!');
            }
        })
    }  ).normalizeEmail() ,
    body('password','Enter password of min 5 and without any special character.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .custom((value , {req}) => {
        if(value !== req.body.confirmPassword) {
            throw new Error('Password not matching!');
        }
        else return true;
    }),
    
    ]
    ,authController.postSignup);

router.get('/signup', authController.getSignup);


router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset', authController.postReset);

router.post('/update-password' , authController.updatePassword);

module.exports = router;