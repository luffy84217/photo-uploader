var express = require('express');
var router = express.Router();
var handleLangs = require('../middleware/handleLangs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/en');
});

router.get('/:lang', handleLangs);

/* GET gzip encode */
router.get('/**/*.min.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

module.exports = router;
