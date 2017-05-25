var express = require('express');
var router = express.Router();

var Picture = require('../models/picture');

router.get('/:pictureId', function (req, res, next) {
    Picture.getPicture(req.params.pictureId, (result) => {
        if (!result.success) {
            res.status(404);
            res.send({status: 'Picture not found'});
        } else {
            var imageBuffer = decodeBase64Image(result.data.attributes.data);
            res.writeHead(200, {'Content-Type': imageBuffer.type});
            res.end(imageBuffer.buffer, 'binary'); // Send the file data to the browser.
        }
    });
});

router.post('/', function (req, res, next) {
    Picture.addPicture(req.body.data, (success, picture) => {
        if(!success){
            res.status(500);
            res.send({status: 'Picture not added'});
        }else{
            console.log('picture added(router)' + picture.pictureId);
            res.status(200);
            res.send({status: 'Success'});
        }
    });
});

function decodeBase64Image(dataString) {
    dataString = dataString.replace(/\n/g, '');
    let matches = dataString.match(/data:([A-Za-z-+\/]+);base64,(.+)/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.buffer = new Buffer(matches[2], 'base64');
    return response;
}

module.exports = router;