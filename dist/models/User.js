"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config_1 = require("../config");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Enter a first name'],
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    displayName: {
        type: String,
        required: [true, 'Enter a first name'],
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: 6
    },
    tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
});
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt
        .sign({ _id: user._id.toHexString(), access }, config_1.default.JWT_SECRET)
        .toString();
    user.tokens.push({ access, token });
    return user.save().then(() => token);
};
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    return User.findOne({ email })
        .then(user => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, config_1.default.JWT_SECRET);
    }
    catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
// middleware before save
UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
const User = mongoose.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map