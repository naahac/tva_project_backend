var db = require('../database/database');

class Picture {
    constructor(pictureId, data) {
        if(pictureId !== undefined)
            this.pictureId = pictureId;
        this.data = data;
    }

    static getPicture(pictureId, callback) {
        new db.Pictures({pictureId : pictureId})
        .fetch()
        .then((model) => {
            if(model === null)
                callback({success: false});
            else
                callback({success: true, data : model});
        });
    }

    static addPicture(data, callback) {
            let picture = new Picture(undefined, data);
            new db.Pictures(picture).save(null, { method: 'insert' });
            callback(true);
    }
}

module.exports = Picture;