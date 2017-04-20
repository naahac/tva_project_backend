var express = require('express');
var router = express.Router();

var User = require("./../models/user");
var Token = require("./../models/token");

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Recept Backend' });
});

router.post('/login', function (req, res, next) {
	if (!req.body.username || !req.body.password) {
		res.status(400);
		res.send({ status: 'Login data not received!' });
	}

	User.getUserIdByLoginData(req.body.username, req.body.password, (result) => {
		if (!result.success) {
			res.status(404);
			res.send({ status: 'User not found' });
			return;
		}

		Token.login(result.data, (result) => {
			if (!result.success) {
				res.status(404);
				res.send({ status: 'Encountered error while logging in' });
				return;
			}

			res.json(result.data);
		});
	});
});

router.post('/logout', function (req, res, next) {
	if (req.body.tokenId) {
		Token.logout(req.body.tokenId, (result) => {
			res.json(result.success);
		});
	}
	else {
		res.status(400);
		res.send({ status: 'Token not received' });
	}
});

module.exports = router;
