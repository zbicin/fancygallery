'use strict';
var express = require('express');
var multer = require('multer');
var qfs = require('q-io/fs');
var models = require('../models');
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

router.get('/', function(req, res) {
  models.Picture.findAll().then(function(pictures) {
    res.render('panel/index', {
      pictures: pictures
    });
  });
});

router.get('/add', function (req, res) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    res.render('panel/add', {
      categories: categories
    });
  });
});

router.post('/add', [uploads.single('pictureFile'), function (req, res) {
//  var thumbnailPath = req.file.path + '_thumb';
  var thumbnailPath = req.file.path;
  models.Picture.create({
    categoryName: req.body.categoryName,
    url: '/'+ req.file.path.split('\\').join('/'),
    thumbnailUrl: thumbnailPath
  })/*.then(function() {
    return thumbnails.generate(req.file.path, thumbnailPath);
  })*/.then(function () {
    res.redirect('/');
  });
}]);

router.get('/remove/:pictureId', function (req, res) {
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
    res.redirect('panel/');
  }).catch(console.error);
});

router.get('/init', function (req, res) {
  function initSingle (url) {
      models.Picture.create({
        categoryName: category,
        url: url,
        thumbnailUrl: url
      }).catch(console.error);
    }
  
  for (var category in seedData) {
    seedData[category].forEach(initSingle);
  }

  res.send('done');
});

module.exports = router;