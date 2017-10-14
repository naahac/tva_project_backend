var db = require('../database/database');

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

class Token {
	constructor(tokenId, createDate,validToDate, active, userId) {
		this.tokenId = tokenId;
		this.createDate = createDate;
        this.validToDate = validToDate;
		this.active = active;
		this.userId = userId;
	}

	static login(userId, callback) {
		this.getActiveTokenIdByUserId(userId, (result) => {
			if (!result.success) {
				this.createToken(userId, (result) => {
					callback(result);
				});
			}else
				callback(result);
		});
	}

	static logout(tokenId, callback) {
		new db.Tokens({ tokenId: tokenId })
			.save({ active: false }, {patch: true})
			.then((model) => {
				if (model == null)
					callback({ success: false });

				callback({ success: true });
			})
			.catch((err) => {
				callback({ success: false });
			});
	}

	static createToken(userId, callback) {
		let tokenId = this.CreateGUID();
		let token = new Token(tokenId, new Date().toISOString(),(new Date().addDays(14)).toISOString() , true, userId);

		new db.Tokens(token)
			.save(null, { method: 'insert' })
			.then((model) => {
				callback({ success: true, data: tokenId });
			})
			.catch((err) => {
				callback({ success: false });
			});
	}

	static getActiveToken(tokenId, callback) {
		new db.Tokens()
			.where('tokenId', tokenId)
			.where('validToDate', '>', new Date())
			.fetch()
			.then((model) => {
				if (model == null)
					callback({success:false});
				else
					callback({success:true, data:model});
			})
			.catch((err) => {
				callback({success:false});
			});
	}

	static getActiveTokenIdByUserId(userId, callback) {
		new db.Tokens({ "userId":userId, 'active':true })
			.fetch()
			.then((model) => {
				if (model == null)
					callback({success:false});
				else
					callback({success:true, data:model});
			})
			.catch((err) => {
				callback({success:false});
			});
	}

	static S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	static CreateGUID() {
		return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
	}
}

module.exports = Token;