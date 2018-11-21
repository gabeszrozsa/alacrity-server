"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActivityType_1 = require("../models/ActivityType");
class ActivityTypeController {
    addNewActivityType(req, res) {
        const newActivityType = new ActivityType_1.default({
            name: req.body.name,
            createdBy: req.body.user._id
        });
        newActivityType.save()
            .then(token => res.send(newActivityType._id))
            .catch(error => res.status(400).send(error));
    }
    getAllActivityTypes(req, res) {
        ActivityType_1.default.find({}, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
    getActivityType(req, res) {
        const id = req.params.id;
        if (!ActivityType_1.default.validateID(id)) {
            return res.status(404).send();
        }
        ActivityType_1.default.findById(id).then(result => {
            if (!result) {
                res.status(404).send();
            }
            res.json(result);
        });
    }
    deleteActivityType(req, res) {
        const id = req.params.id;
        if (!ActivityType_1.default.validateID(id)) {
            return res.status(404).send();
        }
        ActivityType_1.default.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted activity type!' });
        });
    }
    updateActivityType(req, res) {
        ActivityType_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
}
exports.default = ActivityTypeController;
//# sourceMappingURL=ActivityTypeController.js.map