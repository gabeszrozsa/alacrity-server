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
const Location_1 = require("../models/Location");
const Activity_1 = require("../models/Activity");
const ActivityType_1 = require("../models/ActivityType");
const User_1 = require("../models/User");
class ActivityController {
    constructor() {
        this.getActivity = this.getActivity.bind(this);
        this.getAllActivities = this.getAllActivities.bind(this);
        this.getComments = this.getComments.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.getLikes = this.getLikes.bind(this);
        this.addLike = this.addLike.bind(this);
        this.deleteLike = this.deleteLike.bind(this);
        this.getLikesWithUsers = this.getLikesWithUsers.bind(this);
        this.getCommentsWithUsers = this.getCommentsWithUsers.bind(this);
    }
    addNewActivity(req, res) {
        const newActivity = new Activity_1.default({
            date: req.body.date,
            location_id: req.body.location_id,
            activityType_id: req.body.activityType_id,
            durationInSeconds: req.body.durationInSeconds,
            distanceInMeters: req.body.distanceInMeters,
            createdBy: req.body.user._id
        });
        newActivity.save()
            .then(token => res.send(newActivity._id))
            .catch(error => res.status(400).send(error));
    }
    getAllActivities(req, res) {
        Activity_1.default.find({}, (err, activities) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            const results = [];
            for (let activity of activities) {
                try {
                    const data = yield Promise.all([
                        this.getLocation(activity.location_id),
                        this.getActivityType(activity.activityType_id)
                    ]);
                    const location = data[0];
                    const activityType = data[1];
                    const result = this.createActivity(activity, location, activityType);
                    results.push(result);
                }
                catch (error) {
                    console.log('[ERROR] - ActivityController :: getAllActivities');
                }
            }
            res.json(results);
        }));
    }
    getActivity(req, res) {
        const id = req.params.id;
        if (!Activity_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Activity_1.default.findById(id).then((activity) => __awaiter(this, void 0, void 0, function* () {
            if (!activity) {
                res.status(404).send();
            }
            try {
                const data = yield Promise.all([
                    this.getLocation(activity.location_id),
                    this.getActivityType(activity.activityType_id)
                ]);
                const location = data[0];
                const activityType = data[1];
                const result = this.createActivity(activity, location, activityType);
                res.json(result);
            }
            catch (error) {
                console.log('[ERROR] - ActivityController :: getActivity', error);
            }
        }));
    }
    deleteActivity(req, res) {
        const id = req.params.id;
        if (!Activity_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Activity_1.default.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted activity!' });
        });
    }
    updateActivity(req, res) {
        Activity_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
    addComment(req, res) {
        const id = req.params.id;
        const comment = {
            text: req.body.text,
            createdBy: req.body.user._id
        };
        Activity_1.default.findOneAndUpdate({ _id: id }, { $push: { comments: comment } }, { new: true }, (err, activity) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            const comments = yield this.getCommentsWithUsers(activity.comments);
            res.json(comments);
        }));
    }
    getComments(req, res) {
        const id = req.params.id;
        if (!Activity_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Activity_1.default.findById(id).then((activity) => __awaiter(this, void 0, void 0, function* () {
            if (!activity) {
                res.status(404).send();
            }
            const comments = yield this.getCommentsWithUsers(activity.comments);
            res.json(comments);
        }));
    }
    deleteComment(req, res) {
        const id = req.params.id;
        const commentId = req.params.comment;
        Activity_1.default.findOneAndUpdate({ _id: id }, { $pull: { comments: { _id: commentId } } }, { new: true }, (err, activity) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            const comments = yield this.getCommentsWithUsers(activity.comments);
            res.json(comments);
        }));
    }
    addLike(req, res) {
        const _id = req.params.id;
        const createdBy = req.body.user._id;
        const like = { createdBy };
        Activity_1.default.findOneAndUpdate({ _id, 'likes.createdBy': { $ne: createdBy } }, { $addToSet: { likes: like } }, { new: true }, (err, activity) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            if (!activity) {
                res.status(404).send();
            }
            const likes = yield this.getLikesWithUsers(activity.likes);
            res.json(likes);
        }));
    }
    getLikes(req, res) {
        const id = req.params.id;
        if (!Activity_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Activity_1.default.findById(id).then((activity) => __awaiter(this, void 0, void 0, function* () {
            if (!activity) {
                res.status(404).send();
            }
            const likes = yield this.getLikesWithUsers(activity.likes);
            res.json(likes);
        }));
    }
    deleteLike(req, res) {
        const _id = req.params.id;
        const likeId = req.params.like;
        Activity_1.default.findOneAndUpdate({ _id }, { $pull: { likes: { _id: likeId } } }, { new: true }, (err, activity) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.send(err);
            }
            if (!activity) {
                res.status(404).send();
            }
            const likes = yield this.getLikesWithUsers(activity.likes);
            res.json(likes);
        }));
    }
    getCommentsWithUsers(activityComments) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = [];
            for (let comment of activityComments) {
                try {
                    const user = yield this.getUser(comment.createdBy);
                    const result = {
                        _id: comment._id,
                        text: comment.text,
                        createdAt: comment.createdAt,
                        createdBy: user
                    };
                    comments.push(result);
                }
                catch (error) {
                    console.log('[ERROR] - ActivityController :: getCommentsWithUsers', error);
                }
            }
            return comments;
        });
    }
    getLikesWithUsers(likes) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            for (let like of likes) {
                try {
                    const user = yield this.getUser(like.createdBy);
                    const result = {
                        _id: like._id,
                        createdAt: like.createdAt,
                        createdBy: user
                    };
                    data.push(result);
                }
                catch (error) {
                    console.log('[ERROR] - ActivityController :: getLikesWithUsers', error);
                }
            }
            return data;
        });
    }
    createActivity(activity, location, activityType) {
        return {
            _id: activity._id,
            date: activity.date,
            location: location,
            activityType: activityType,
            durationInSeconds: activity.durationInSeconds,
            distanceInMeters: activity.distanceInMeters,
            comments: activity.comments,
            likes: activity.likes,
            createdAt: activity.createdAt,
            createdBy: activity.createdBy,
        };
    }
    getLocation(location_id) {
        return new Promise((resolve, reject) => {
            Location_1.default.findById(location_id).then(result => {
                if (!result) {
                    reject(`No Location with ID: ${location_id}`);
                }
                resolve(result);
            });
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
    getActivityType(activityType_id) {
        return new Promise((resolve, reject) => {
            ActivityType_1.default.findById(activityType_id).then(result => {
                if (!result) {
                    reject(`No ActivityType with ID: ${activityType_id}`);
                }
                resolve(result);
            });
        });
    }
}
exports.default = ActivityController;
//# sourceMappingURL=ActivityController.js.map