'use strict';
var express = require('express');
var models = require('../models');
var configuration = require('../custom_modules/configuration');

var router = express.Router();

router.use(configuration);

router.get('/', function (req, res) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    res.render('index', {
      categories: categories
    });
  });
});

router.get('/contact', function (req, res) {
  res.render('contact');
});

router.post('/contact', function (req, res) {
  models.Message.create({
    author: req.body.author,
    content: req.body.content
  }).then(function () {
    res.redirect('/thanks');
  });
});

router.get('/thanks', function (req, res) {
  res.render('thanks');
});

module.exports = router;
