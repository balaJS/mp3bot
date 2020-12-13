var express = require('express');
var router = express.Router();
var msfmultiselect = require('msfmultiselect');

const songs = [
  {'value': 1, 'innerhtml': 'Song 1', 'selected': false},
  {'value': 2, 'innerhtml': 'Song 2'},
  {'value': 3, 'innerhtml': 'Song 3'},
  {'value': 4, 'innerhtml': 'Song 4'},
  {'value': 5, 'innerhtml': 'Song 5'},
  {'value': 6, 'innerhtml': 'Song 6', 'selected': true},
  {'value': 7, 'innerhtml': 'Song 7'},
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('app', { title: 'MP3BOT', content: 'home page', songs: songs });
});

router.get('/test', function(req, res, next) {
  res.render('app', { title: 'MP3BOT', content: 'Search here', songs: songs });
});

module.exports = router;
