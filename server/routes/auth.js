const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            // birthday: profile.birthday,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value,


        }
        try {
            let user = await User.findOne({ googleId: profile.id })
            if (user) {
                done(null, user)
            }
            else {
                user = await User.create(newUser);
                done(null, user);
            }

        } catch (error) {
            console.log(error);
        }
    }
));

//!Google Login Route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

//! Retrieve User Data
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/dashboard'
    }),

);

//! Route if Something goes wrong
router.get('/login-failure', (req, res) => {
    res.send('Failed to login with Google');
})


//! Destroy user Session(LogOut)
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send("Error While logging out: " + error)
        } else {
            res.redirect('/')
        }
    });
})

//! Presist User Data After Successful Authentication
passport.serializeUser((user, done) => {
    done(null, user.id);
})


//! Retrieve User Data From A Session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


module.exports = router