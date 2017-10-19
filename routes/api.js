var express = require('express');
var router = express.Router();
var handleUpload = require('../middleware/handleUpload');

/* GET users listing. */
router.put('/upload', handleUpload);

module.exports = router;
