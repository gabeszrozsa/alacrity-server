"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes_1 = require("./routes/routes");
const config_1 = require("./config");
class App {
    constructor() {
        this.route = new routes_1.Routes();
        this.mongoUrl = config_1.default.MONGO_URL;
        this.app = express();
        this.config();
        this.route.routes(this.app);
        this.mongoSetup();
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(cors());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        const options = { useNewUrlParser: true };
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, options).then(() => console.log('[SUCCESS] - Connected to MongoDB.'), err => console.log('[ERROR] - Cannot connect to MongoDB!'));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map