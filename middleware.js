const bcrypt = require('bcrypt');
const express = require('express');
const Middleware = express.Router()
const User = require('./db/User');
const _ = require('lodash');
const co = require('co');
const request = require('request');
const fs = require('fs');
const indico = require('indico.io');

Middleware.checkAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(400).send("Thee must log in!")
  }
}

Middleware.hashPass = function (req, res, next) {
  bcrypt.hash(req.body.password, 14, function(err, hash) {
    if (err) {
      res.err(err);
    } else {
      req.body.password = hash;
      next();
    }
  });
}

Middleware.checkEmailValidity = function (req, res, next) {
  User.findOne({"email": req.body.email}, function (err, result) {
    if (result !== null) {
      res.status(400).send("Your chosen email has already been used by another.")
    } else {
      next()
    }
  });
}

Middleware.checkPass = function (req, res, next) {
  User.findOne({"email": req.body.email}, function (err, result) {
    bcrypt.compare(req.body.password, result.password, function(err, response) {
      if (err) {
        res.err(err)
      }

      if (response) {
        next();
      } else {
        res.status(400).send("Thee's email or password is incorrect");
      }
    });
  })
}

Middleware.makeToken = function (req, res, next) {
  req.session.regenerate(function(err) {
    if (err) {
      res.err(err)
    } else {
      req.session.user = {'email': req.body.email};
      next();
    }
  });
}

Middleware.destroyToken = function (req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      res.err(err)
    } else {
      next();
    }
  });
}

Middleware.findUser = function (req, res, next) {
  co(function* () {
    return User.findOne({email: 'mike.mitrakos@gmail.com'})
  })
  .then(function (user) {
    req.body.resume = user.resume;
    next();
  })
}

module.exports = Middleware;
