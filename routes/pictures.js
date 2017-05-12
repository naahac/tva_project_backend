var express = require('express');
var router = express.Router();

var Picture = require('../models/picture');

router.get('/:pictureId', function (req, res, next) {
        Picture.getPicture(req.params.pictureId, (picture) => {
            if (picture === null) {
                res.status(404);
                res.send({ status: 'Picture not found' });
            } else {
                var imageBuffer = decodeBase64Image(picture.data.attributes.data);
                res.writeHead(200, {'Content-Type': imageBuffer.type});
                res.end(imageBuffer.buffer); // Send the file data to the browser.
            }
        });
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/data:([A-Za-z-+\/]+);base64,(.+)/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.buffer = new Buffer(matches[2], 'base64');
    return response;
}

module.exports = router;