const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const auth = require('../controller/authController')

router.route('/register')
    .get(auth.registerForm)
    .post(catchAsync(auth.registerUser))

router.route('/login')
    .get(auth.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.loggedIn)

router.get('/logout', auth.logout)

module.exports = router