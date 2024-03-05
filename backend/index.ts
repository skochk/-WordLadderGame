import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import bodyParser from 'body-parser';
import cors from "cors";

import dictionaryRoutes from "./routes/dictionaryRoutes";
import gameRoutes from "./routes/gameRoutes";



const app = express();
const server = http.createServer(app);
const io = new Server(server);
const router = express.Router();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/game', gameRoutes); 


// Extend the Socket interface with a custom property roomId
declare module 'socket.io' {
    interface Socket {
        roomId?: string;
    }
}

interface Room {
    users: Socket[];
    gameData?: any;
    timer?: NodeJS.Timeout; // Timer for turn time
}

export const roomList = new Map<string, Room>();

io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (roomId: string, gameData: any) => {
        // Check if the room exists in the Socket.IO instance
        if (!roomList.has(roomId)) {
            console.log('Room not found');
            return;
        }

        // Check if the socket is already in a room
        if (socket.roomId) {
            console.log('Socket is already in a room');
            return;
        }

        const room = roomList.get(roomId);

        if (!room) {
            console.log('Room not found');
            return;
        }

        if (room.users.length >= 2) {
            console.log('Room is full');
            return;
        }

        room.users.push(socket);
        socket.roomId = roomId; // Add roomId property to the socket
        socket.join(roomId); // Add the user to the Socket.IO room
        console.log(`User joined room ${roomId}`);

        if (room.users.length === 2) {
            // Send gameData from the first user to the second user
            room.users[1].emit('gameData', gameData);
        } else {
            // Save gameData from the first user if no second user yet
            room.gameData = gameData;
        }
    });

    socket.on('gameUpdate', (gameData: any) => {
        const roomId = socket.roomId;
        if (!roomId || !roomList.has(roomId)) {
            console.log('Invalid room or room not found');
            return;
        }

        const room = roomList.get(roomId);

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
            io.to(roomId).emit('gameData', room.gameData);
        }, room.gameData.turnTime * 1000); // Convert turnTime to milliseconds
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const roomId = socket.roomId;
        if (roomId) {
            const room = roomList.get(roomId);
            if (room) {
                const index = room.users.indexOf(socket);
                if (index !== -1) {
                    room.users.splice(index, 1);
                    // If no users left in the room, remove the room
                    if (room.users.length === 0) {
                        roomList.delete(roomId);
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
