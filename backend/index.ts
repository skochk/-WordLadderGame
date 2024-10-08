import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import bodyParser from 'body-parser';
import cors from "cors";

import dictionaryRoutes from "./routes/dictionaryRoutes";
import gameRoutes from "./routes/gameRoutes";



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io","http://localhost:3000"],
      credentials: true
    }
  });

instrument(io, {
    auth: false
});


// const router = express.Router();

app.use(bodyParser.json());
app.use(cors());

// app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/game', gameRoutes); 


// Extend the Socket interface with a custom property roomID
declare module 'socket.io' {
    interface Socket {
        roomID?: string;
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

    socket.on('joinRoom', (eventData: any) => {
        console.log('joinRoom event', eventData.roomID)
        // Check if the room exists in the Socket.IO instance
        if (!roomList.has(eventData.roomID)) {
            console.log('Room not found');
            return;
        }

        // Check if the socket is already in a room
        if (socket.roomID) {
            console.log('Socket is already in a room');
            return;
        }

        const room = roomList.get(eventData.roomID);

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
        } else {
            // Save gameData from the first user if no second user yet
            room.gameData = eventData.gameData;
        }
    });

    socket.on('gameUpdate', (gameData: any) => {
        const roomID = socket.roomID;
        if (!roomID || !roomList.has(roomID)) {
            console.log('Invalid room or room not found');
            return;
        }

        const room = roomList.get(roomID);

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
            const room = roomList.get(roomID);
            if (room) {
                const index = room.users.indexOf(socket);
                if (index !== -1) {
                    room.users.splice(index, 1);
                    // If no users left in the room, remove the room
                    if (room.users.length === 0) {
                        roomList.delete(roomID);
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

