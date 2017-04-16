var db = require('../database/database');
var Person = require('./person.js');

class User {
    constructor(userId, name, surname, username, password, email) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    static getUser(personId, callback) {
        new db.Users({userId : personId})
        .fetch()
        .then((model) => {
            if(model == null)
                callback({success: false});
            else
                callback({success: true, data :model});
        });
    }

    static updateUser(personId, name, surname, username, password, email, callback) {
        new db.Users({ userId: personId })
			.save({ userId:personId,
                name:name,
                surname:surname,
                username:username,
                password:password,
                email:email },
                {patch: true})
			.then((model) => {
				if (model == null)
					callback({ success: false });
				callback({ success: true });
			})
			.catch((err) => {
				callback({ success: false });
			});
    }

    static deleteUser(personId, callback) {
        new db.Users()
        .where('userId', personId)
        .destroy()
        .then(() => {
            callback({success:true});
        })
        .catch( (err) => {
            callback({success:false});
        });
    }

    static createUser(name, surname, username, password, email, callback) {
        User.checkUsername(username, (usernameExists) => {
            if (usernameExists) {
                callback(false);
                return;
            }

            let user = new User(undefined, name, surname, username, password, email);
            new db.Users(user).save(null, { method: 'insert' });

            callback(true);
        });
    }

    static checkUsername(username, callback) {
        new db.Users({ 'username': username })
            .fetch()
            .then((model) => {
                if (model == null)
                    callback(false);
                else
                    callback(true);
            })
            .catch((err) => {
                callback(false);
            });
    }

    static getUserIdByLoginData(username, password, callback) {
        new db.Users({ 'username': username, 'password': password })
            .fetch()
            .then((model) => {
                if (model == null)
                    callback({success:false});
                
                callback({success:true, data:model.get('userId')});
            })
            .catch((err) => {
                callback({success:false});
            });
    }
}

module.exports = User;