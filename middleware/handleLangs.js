var en = require('../locales/en');
var zh = require('../locales/zh');
var ja = require('../locales/ja');

module.exports = function (req, res, next) {
    switch (req.params.lang) {
        case 'en':
            res.render('index', en);
            break;
        case 'zh':
            res.render('index', zh);
            break;
        case 'ja':
            res.render('index', ja);
            break;
    }
};