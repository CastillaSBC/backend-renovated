import {Server} from 'socket.io';
export const io = new Server({
	/* options */
});

io.on('connection', (socket) => {});
