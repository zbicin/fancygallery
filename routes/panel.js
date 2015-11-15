'use strict';
var express = require('express');
var multer = require('multer');
var qfs = require('q-io/fs');
var models = require('../models');
var uploads = multer({ dest: 'uploads/' });

var router = express.Router();

var defaultConfigurationEntries = [
  {
    key: 'title',
    value: 'My Fancy Gallery'
  },
  {
    key: 'subtitle',
    value: 'Lorem lipsum'
  }
];

router.get('/', function (req, res) {
  models.Configuration.findAll().then(function (configurationEntries) {
    var title = configurationEntries[0].value;
    var subtitle = configurationEntries[1].value;
    res.render('panel/index', {
      title: title,
      subtitle: subtitle
    });
  });
});

router.post('/', function (req, res) {
  function updateSingleEntry(key, value) {
    return models.Configuration.update({
      value: value
    }, {
        where: {
          key: key
        }
      });
  }
  
  updateSingleEntry('title', req.body.title).then(function() {
    return updateSingleEntry('subtitle', req.body.subtitle);
  }).then(function() {
    res.redirect('/panel');
  });
});

router.get('/pictures', function (req, res) {
  models.Picture.findAll().then(function (pictures) {
    res.render('panel/pictures', {
      pictures: pictures
    });
  });
})

router.get('/add', function (req, res) {
  models.Picture.aggregate('categoryName', 'DISTINCT', {
    plain: false
  }).then(function (categories) {
    return [
      categories,
      models.Picture.aggregate('author', 'DISTINCT', { plain: false })
    ];
  }).spread(function (categories, authors) {
    res.render('panel/add', {
      categories: categories,
      authors: authors
    });
  });
});

router.post('/add', [uploads.single('pictureFile'), function (req, res) {
  models.Picture.create({
    categoryName: req.body.categoryName,
    url: '/' + req.file.path.split('\\').join('/'),
    description: req.body.description,
    author: req.body.author
  }).then(function () {
    res.redirect('/panel/pictures');
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
  function initSingle(entry) {
    models.Configuration.create(entry).catch(console.error);
  }

  defaultConfigurationEntries.forEach(initSingle);

  models.Message.create({
    content: 'Lorem lipsum message',
    author: 'test@example.com',
    isRead: false
  }).catch(console.error);

  res.send('done');
});

module.exports = router;