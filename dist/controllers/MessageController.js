"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
class MessageController {
    constructor() {
        this.getMyMessages = this.getMyMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.fetchMyMessages = this.fetchMyMessages.bind(this);
        this.getMessagesWithUsers = this.getMessagesWithUsers.bind(this);
    }
    sendMessage(req, res) {
        const currentUser = req.body.user._id;
        const newMessage = new Message_1.default({
            text: req.body.text,
            recipient_id: req.body.recipient_id,
            createdBy: currentUser
        });
        newMessage.save()
            .then(result => {
            this.fetchMyMessages(currentUser)
                .then(result => res.json(result))
                .catch(error => res.status(400).send(error));
        })
            .catch(error => res.status(400).send(error));
    }
    getMyMessages(req, res) {
        const currentUser = req.body.user._id;
        this.fetchMyMessages(currentUser)
            .then(result => res.json(result))
            .catch(error => res.status(400).send(error));
    }
    deleteMessage(req, res) {
        const id = req.params.id;
        const currentUser = req.body.user._id;
        if (!Message_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Message_1.default.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                res.send(err);
            }
            this.fetchMyMessages(currentUser)
                .then(result => res.json(result))
                .catch(error => res.status(400).send(error));
        });
    }
    fetchMyMessages(currentUser) {
        return Promise.all([
            Message_1.default.find({ 'createdBy': currentUser })
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                const messagesWithUsers = yield this.getMessagesWithUsers(res, 'recipient_id');
                return messagesWithUsers;
            })),
            Message_1.default.find({ 'recipient_id': currentUser })
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                const messagesWithUsers = yield this.getMessagesWithUsers(res, 'createdBy');
                return messagesWithUsers;
            }))
        ])
            .then(result => ({ sent: result[0], received: result[1] }))
            .catch(error => error);
    }
    getMessagesWithUsers(messagesData, targetUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [];
            for (let msg of messagesData) {
                try {
                    const partner = yield this.getUser(msg[targetUser]);
                    const result = {
                        _id: msg._id,
                        text: msg.text,
                        createdAt: msg.createdAt,
                        createdBy: msg.createdBy,
                        recipient_id: msg.recipient_id,
                        partner: partner
                    };
                    messages.push(result);
                }
                catch (error) {
                    console.log('[ERROR] - MessageController :: getMessagesWithUsers', error);
                }
            }
            return messages;
        });
    }
    getUser(user_id) {
        return new Promise((resolve, reject) => {
            User_1.default.findById(user_id).then(result => {
                if (!result) {
                    reject(`No User with ID: ${user_id}`);
                }
                resolve({ _id: result._id, email: result.email, displayName: result.displayName });
            });
        });
    }
}
exports.default = MessageController;
//# sourceMappingURL=MessageController.js.map