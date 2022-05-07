import { server } from "./structures/server";
import { io } from "./ws/ws";

io.listen(server.server)
server.init()