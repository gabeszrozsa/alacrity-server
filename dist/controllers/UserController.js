"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
class UserController {
    addNewUser(req, res) {
        const newUser = new User_1.default({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName
        });
        newUser.save()
            .then(() => newUser.generateAuthToken())
            .then(token => {
            const { _id, displayName, email } = newUser;
            const user = { _id, displayName, email, token };
            res.header('x-auth', token).send(user);
        })
            .catch(error => res.status(400).send(error));
    }
    getAllUsers(req, res) {
        User_1.default.find({}, (err, result) => {
            if (err) {
                res.send(err);
            }
            const users = result.map(u => ({ _id: u._id, displayName: u.displayName, email: u.email }));
            res.json(users);
        });
    }
    loginWithUser(req, res) {
        User_1.default.findByCredentials(req.body.email, req.body.password)
            .then(user => user.generateAuthToken()
            .then(token => {
            const { _id, displayName, email } = user;
            const currentUser = { _id, displayName, email, token };
            res.header('x-auth', token).send(currentUser);
        }))
            .catch(e => res.status(400).send());
    }
    authenticate(req, res, next) {
        const token = req.header('x-auth');
        User_1.default.findByToken(token)
            .then(user => {
            if (!user) {
                console.log('no user');
                return Promise.reject();
            }
            req.body.user = user;
            req.body.token = token;
            next();
        })
            .catch(error => res.status(401).send());
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map