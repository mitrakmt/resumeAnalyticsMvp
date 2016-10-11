const Router = require('express').Router();
const db = require('./db');
const User = require('./db/User');
const Middleware = require('./middleware');
const Helpers = require('./helpers');
const _ = require('lodash');
const Promise = require('co');
const request = require('request');

// Sign up user
Router.route('/signup')
  .post(Middleware.checkEmailValidity, Middleware.hashPass, Middleware.makeToken, function(req, res) {
    User.create(req.body, function (err, result) {
      if (err) {
        res.err(err)
      } else {
        res.status(200).send(result)
      }
    })
  });

Router.route('/logout')
  .post(Middleware.destroyToken, function (req, res) {
    res.status(200).send("You have successfully logged out");
  })

Router.route('/login')
  .post(Middleware.checkPass, Middleware.makeToken, function (req, res) {
    res.status(200).send("Login successful");
  });

Router.route('/fileUpload')
  .get(Middleware.findUser, Helpers.languageScore, Helpers.keywords, Helpers.lengthChecker, Helpers.keywords, Helpers.totalScore, (req, res) => {
      console.log("Score: ", req.body.totalScore)

      res.status(200).send({
        "body": req.body
      });
  })


module.exports = Router;
