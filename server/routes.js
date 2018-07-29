/**
 * @file Handles express routes for user registration, login, and logout.
 */

var express = require('express');
var router = express.Router();
var models = require('../models/models');

module.exports = function(passport) {
    router.post('/register', function(req, res) {
        var u = new models.User({
            username: req.body.username,
            password: req.body.password,
            docList: []
        })
        u.save(function(err, user) {
            if(err) {
                res.status(500).json({err: err.message})
                return
            }
            res.status(200).json({success: true})
        })
    });

    router.post('/login', passport.authenticate('local'), function(req, res) {
        res.send('User logged in')
    });

    router.get('/logout', function(req, res) {
        req.logout()
        res.json({success: true})
    });

    return router;
};