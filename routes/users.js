var express = require('express');
var router = express.Router();

var checkToken = require('../utilities/checkToken');

var User = require('../models/user');
var Token = require('../models/token');

router.get('/', function (req, res, next) {
    checkToken(req.query.tokenId, res);

    Token.getActiveToken(req.query.tokenId, (result) => {
        if (!result.success) {
            res.status(404);
            res.send({ status: 'Token not found!' });
        }

        User.getUser(result.data.get('userId'), (user) => {
            if (user == null) {
                res.status(404);
                res.send({ status: 'User not found' });
            } else {
                res.json(user);
            }
        });
    });
});

router.put('/', function (req, res, next) {
    checkToken(req.body.tokenId, res);

    if (!req.body.name || !req.body.surname || !req.body.username || !req.body.password || !req.body.email) {
        res.status(400);
        res.send({ status: 'Requested data not received!' });
    }

    Token.getUserId(req.body.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({ status: 'User was not found!' });
        }

        User.updateUser(userId, req.body.name, req.body.surname, req.body.username, req.body.password, req.body.email,
            (result) => {
                if (!result.success) {
                    res.status(404);
                    res.send({ status: 'Error while updating!' });
                }
                else {
                    res.send({ status: 'OK' });
                }
            });
    });
});

router.post('/register', function (req, res, next) {
    if (!req.body.name || !req.body.surname || !req.body.username || !req.body.password || !req.body.email) {
        res.status(400);
        res.send({ status: 'Requested data not received!' });
    }

    User.createUser(req.body.name, req.body.surname, req.body.username, req.body.password, req.body.email,
        (result) => {
            if (!result.success) {
                res.status(422);
                res.send('Error while inserting data!');
            }
            else {
                res.send('OK');
            }
        });
});

router.delete('/', function (req, res, next) {
    checkToken(req.body.tokenId, res);

    Token.getActiveToken(req.body.tokenId, (result) => {
        if (!result.success) {
            res.status(400);
            res.send({ status: 'Token was not found!' });
        }

        User.deleteUser(result.data.get('userId'), (result) => {
            if (!result.success) {
                res.status(404);
                res.send('Error while deleting data!');
            }
            else {
                res.send({ status: 'OK' });
            }
        });
    });
});

module.exports = router;