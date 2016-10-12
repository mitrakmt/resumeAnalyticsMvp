const bcrypt = require('bcrypt');
const express = require('express');
const Helpers = express.Router()
const User = require('./db/User');
const _ = require('lodash');
const co = require('co');
const request = require('request');
const fs = require('fs');
const indico = require('indico.io');

Helpers.readability = function (req, res, next) {
  let shortened = req.body.resume.split(' ').slice(10, 150).join(' ');
  var options = {
    'method': 'POST',
    'url': 'https://wizenoze-reading-level-classification-v1.p.mashape.com/v1/classify/text',
    'headers': {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'accept': 'application/json',
      'x-mashape-key': 'KEZLKVz5TSmshYkXjK6TsIqvTAo0p1ETPdZjsnXYbygs6bNYbX'
    },
    'body': {
       'text': shortened,
       'languageCode': 'en'
     },
    'json': true
  };

  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    }

    req.body.readability = body.audience.level;
    next();
  });
}

// Check for key words
Helpers.keywords = function (req, res, next) {
  let resumeArray = req.body.resume.split(' ');
  let keywords = ['node', 'javascript', 'angular', 'react', 'engineer', 'express', 'automation', 'machine learning', 'big data', 'mongo', 'sql', 'objective', 'data architecture', 'python', 'testing', 'software', 'c#', 'css', 'backbone', 'java', 'agile', 'engineering', 'ruby', 'responsive', 'mit', 'harvard', 'hack reactor', 'makersquare', 'stanford', 'science'];
  let count = 0;
  resumeArray.forEach(function (word) {
    if (_.includes(keywords, word.toLowerCase())) {
      count++;
    }
  });

  if (count > 15) {
    req.body.keywordsHelp = "Great use of industry keywords!"
  } else {
    req.body.keywordsHelp = "Try to use more industry and job specific keywords throughout your resume."
  }

  req.body.keywords = count;
  next();
}

Helpers.languageScore = function (req, res, next) {
  var options = {
    method: 'GET',
    url: 'https://twinword-language-scoring.p.mashape.com/text/',
    qs: {
      text: req.body.resume
    },
    headers: {
       'cache-control': 'no-cache',
       'content-type': 'jsonp',
       'x-mashape-key': 'KEZLKVz5TSmshYkXjK6TsIqvTAo0p1ETPdZjsnXYbygs6bNYbX'
    },
    body: {
       annotate: 1,
       keywords: 15,
       lang: 'en',
       sentiment: 1,
       text: req.body.text
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    } else {
      if (body.value < .2) {
        req.body.sentimentHelp = "Try to use a more positive tone in describing what you accomplished... :)";
      } else {
        req.body.sentimentHelp = "Great job on using a positive tone!";
      }

      if (body.value < 2) {
        req.body.languageScoreHelp = "Use more industry level terms bro.";
      } else {
        req.body.languageScoreHelp = "Great word choices!";
      }

      req.body.sentiment = body.value * 10;
      req.body.languageScore = body.ten_degree;
      next();
    }
  });
}

//length based on good numbers inputted
Helpers.lengthChecker = function (req, res, next) {
  let score = 0;
  let resumeLength = req.body.resume.split(' ').length;

  if (resumeLength > 700) {
    score = 3;
    req.body.lengthScoreHelp = "Do you have 15 years of work experience? I didn't think so.. so get your resume down to one page.";
  } else if (resumeLength > 300) {
    score = 15
    req.body.lengthScoreHelp = "Resume length is on point!";
  } else {
    score = 4;
    req.body.lengthScoreHelp = "Time to beef this baby up a little. Just a tad bit short.";
  }

  req.body.lengthScore = score;
  next();
}

Helpers.totalScore = function (req, res, next) {
  req.body.totalScore = (req.body.lengthScore * 1.5) + (req.body.languageScore * 2) + (req.body.keywords * 1.5) + (req.body.sentiment * 3) + (req.body.readability * 2);
  next();
}

module.exports = Helpers;
