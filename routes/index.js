var express = require('express');
var router = express.Router();
var models = require('../models');

var seedData = {
  'Nature': [
    'http://lorempixel.com/output/nature-q-c-640-480-1.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-2.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-3.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-4.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-5.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-6.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-7.jpg',
    'http://lorempixel.com/output/nature-q-c-640-480-8.jpg'
  ],
  'City': [
    'http://lorempixel.com/output/city-q-c-640-480-1.jpg',
    'http://lorempixel.com/output/city-q-c-640-480-2.jpg',
    'http://lorempixel.com/output/city-q-c-640-480-3.jpg',
    'http://lorempixel.com/output/city-q-c-640-480-4.jpg',
    'http://lorempixel.com/output/city-q-c-640-480-5.jpg'
  ]
};

router.get('/', function (req, res, next) {
  models.Picture.findAll().then(function (pictures) {
    res.render('index', {
      pictures: pictures,
      isAuthenticated: true
    });
  });
});

router.get('/add', function(req, res, next) {
  models.Picture.aggregate('categoryName', 'DISTINCT', { 
    plain: false
  }).then(function(categories) {
    res.render('add', {
      categories: categories 
    });  
  });
});

router.get('/init', function (req, res, next) {
  for (var category in seedData) {
    seedData[category].forEach(function (url) {
      models.Picture.create({
        categoryName: category,
        url: url,
        thumbnailUrl: url
      }).catch(function(error) {
        console.error(error);
      });
    });
  }
  
  res.send('done');
});



module.exports = router;
