"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TEST = require("./test");
const DEV = require("./dev");
let config;
if (process.env.NODE_ENV === 'test') {
    config = TEST;
}
else if (process.env.NODE_ENV === 'production') {
    config = {
        MONGO_URL: process.env.MONGO_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    };
}
else {
    config = DEV;
}
exports.default = config;
//# sourceMappingURL=index.js.map