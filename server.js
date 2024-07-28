
const { Server } = require("socket.io");


const io = new Server(8088, {
    cors: {origin: "*"}
});


const players = new Map();

io.on("connection", socket => {

    socket.on("getPlayersPositions", callback => callback(Array.from(players.values())));

    socket.on("characterData", data => {
        players.set(socket, data);
        socket.broadcast.emit('updatePlayersPosition', Array.from(players.values()));
    });

    socket.on("disconnect", () => {
        const id = players.get(socket)?.id;
        players.delete(socket);
        socket.broadcast.emit('destroyPlayer', id);
    });

    socket.on('shoot', data => socket.broadcast.emit('enemyShoot', data));

    socket.on('hit', data => socket.broadcast.emit('hitEnemy', data));
});

