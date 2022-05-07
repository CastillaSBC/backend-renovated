"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./structures/server");
const ws_1 = require("./ws/ws");
ws_1.io.listen(server_1.server.server);
server_1.server.init();
