const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to MyWays!');
            res.redirect('/blogs');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    } 
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loggedIn = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/blogs';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/blogs');
}
