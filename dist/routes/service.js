"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const status_1 = __importDefault(require("../controllers/service/status"));
const users_1 = __importDefault(require("../controllers/service/users"));
const express_1 = require("express");
const service = (0, express_1.Router)();
service.get('/', async (req, res) => await (0, status_1.default)(req, res));
service.get('/data/users', async (req, res) => await (0, users_1.default)(req, res));
exports.default = service;
