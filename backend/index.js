"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomList = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const admin_ui_1 = require("@socket.io/admin-ui");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dictionaryRoutes_1 = __importDefault(require("./routes/dictionaryRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:3000"],
        credentials: true
    }
});
(0, admin_ui_1.instrument)(io, {
    auth: false
});
const router = express_1.default.Router();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/dictionary', dictionaryRoutes_1.default);
app.use('/api/game', gameRoutes_1.default);
exports.roomList = new Map();
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('joinRoom', (eventData) => {
        console.log('joinRoom event', eventData.roomID);
        // Check if the room exists in the Socket.IO instance
        if (!exports.roomList.has(eventData.roomID)) {
            console.log('Room not found');
            return;
        }
        // Check if the socket is already in a room
        if (socket.roomID) {
            console.log('Socket is already in a room');
            return;
        }
        const room = exports.roomList.get(eventData.roomID);
        if (!room) {
            console.log('Room not found');
            return;
        }
        if (room.users.length >= 2) {
            console.log('Room is full');
            return;
        }
        room.users.push(socket);
        socket.roomID = eventData.roomID; // Add roomID property to the socket
        socket.join(eventData.roomID); // Add the user to the Socket.IO room
        console.log(`User joined room ${eventData.roomID}`);
        if (room.users.length === 2) {
            // Send gameData from the first user to the second user
            room.users[1].emit('gameData', eventData.gameData);
        }
        else {
            // Save gameData from the first user if no second user yet
            room.gameData = eventData.gameData;
        }
    });
    socket.on('gameUpdate', (gameData) => {
        const roomID = socket.roomID;
        if (!roomID || !exports.roomList.has(roomID)) {
            console.log('Invalid room or room not found');
            return;
        }
        const room = exports.roomList.get(roomID);
        if (!room) {
            console.log('Room not found');
            return;
        }
        // Clear the existing timer if present
        if (room.timer) {
            clearTimeout(room.timer);
        }
        // Update the game data
        room.gameData = gameData;
        // Start the timer
        room.timer = setTimeout(() => {
            // Toggle playerTurn
            room.gameData.playerTurn = room.gameData.playerTurn === 0 ? 1 : 0;
            // Emit updated game data to all users in the room
            io.to(roomID).emit('gameData', room.gameData);
        }, room.gameData.turnTime * 1000); // Convert turnTime to milliseconds
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const roomID = socket.roomID;
        if (roomID) {
            const room = exports.roomList.get(roomID);
            if (room) {
                const index = room.users.indexOf(socket);
                if (index !== -1) {
                    room.users.splice(index, 1);
                    // If no users left in the room, remove the room
                    if (room.users.length === 0) {
                        exports.roomList.delete(roomID);
                    }
                }
            }
        }
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
