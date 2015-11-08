var express = require('express');
var models = require('../models');

var router = express.Router();


router.get('/', function (req, res, next) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    res.render('index', {
      categories: categories
    });
  });
});

module.exports = router;
