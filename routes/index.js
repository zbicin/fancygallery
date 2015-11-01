var express = require('express');
var multer = require('multer');
var fs = require('fs');
var qfs = require('q-io/fs');
var models = require('../models');
var thumbnails = require('../custom_modules/thumbnails');

var uploads = multer({ dest: 'uploads/' });
var router = express.Router();

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

router.get('/add', function (req, res, next) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    res.render('add', {
      categories: categories
    });
  });
});

router.post('/add', [uploads.single('pictureFile'), function (req, res) {
  var thumbnailPath = req.file.path+'_thumb';
  models.Picture.create({
    categoryName: req.body.categoryName,
    url: req.file.path,
    thumbnailUrl: thumbnailPath
  }).then(function() {
    return thumbnails.generate(req.file.path, thumbnailPath);
  }).then(function () {
    res.redirect('/');
  });
}]);

router.get('/remove/:pictureId', function (req, res, next) {
  models.Picture.findAll({
    where: {
      id: req.params.pictureId
    }
  }).then(function (picture) {
    return [picture, qfs.remove(picture[0].url)];
  }).spread(function (picture) {
    return qfs.remove(picture[0].thumbnailUrl);
  }).then(function () {
    return models.Picture.destroy({
      where: {
        id: req.params.pictureId
      }
    });
  }).then(function () {
    res.redirect('/');
  }).catch(console.error);
});

router.get('/init', function (req, res, next) {
  for (var category in seedData) {
    seedData[category].forEach(function (url) {
      models.Picture.create({
        categoryName: category,
        url: url,
        thumbnailUrl: url
      }).catch(console.error);
    });
  }

  res.send('done');
});



module.exports = router;
