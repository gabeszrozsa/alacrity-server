"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Location_1 = require("../models/Location");
class LocationController {
    addNewLocation(req, res) {
        const newLocation = new Location_1.default({
            name: req.body.name,
            coordinates: req.body.coordinates,
            createdBy: req.body.user._id
        });
        newLocation.save()
            .then(token => res.send(newLocation._id))
            .catch(error => res.status(400).send(error));
    }
    getAllLocations(req, res) {
        Location_1.default.find({}, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
    getLocation(req, res) {
        const id = req.params.id;
        if (!Location_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Location_1.default.findById(id).then(result => {
            if (!result) {
                res.status(404).send();
            }
            res.json(result);
        });
    }
    deleteLocation(req, res) {
        const id = req.params.id;
        if (!Location_1.default.validateID(id)) {
            return res.status(404).send();
        }
        Location_1.default.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted location!' });
        });
    }
    updateLocation(req, res) {
        Location_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    }
}
exports.default = LocationController;
//# sourceMappingURL=LocationController.js.map