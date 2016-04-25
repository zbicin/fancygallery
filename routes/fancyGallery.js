'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/images/:categoryName', function(req, res) {
  models.Picture.findAll({
    where: {
      categoryName: req.params.categoryName
    }
  }).then(function(pictures) {
    res.render('fancyGallery/images', {
      pictures: pictures
    });    
  });
});

router.get('/categories', function(req, res) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    res.render('fancyGallery/categories', {
      categories: categories
    });
  });
});

module.exports = router;