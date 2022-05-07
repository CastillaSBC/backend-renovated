"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function logout(req, response) {
    response.clearCookie("token");
    response.status(200).json({
        message: "Logged off."
    });
}
exports.default = logout;
