var fs = require('fs');
const utils = require('../utils');

function handleUpload (req, res, next) {
    const dataURL = req.body.dataURL;
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = dataURL.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = new Buffer(data, 'base64');

    fs.writeFile(`./upload/${utils.uuid()}.${ext}`, buffer, err => {
        if (err) throw err;
        res.send('Upload has been completed successfully!');
    });
}

module.exports = handleUpload;