"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getService(req, res) {
    // return an object with the status and headers
    return res.status(200).send({
        time: Date.now(),
        version: "1.0.0",
        message: "Service is running"
    });
}
exports.default = getService;
