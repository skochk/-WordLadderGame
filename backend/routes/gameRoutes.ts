import express, { Request, Response } from 'express';
import { roomList } from "../index";
import { getFirstWord } from "../controllers/dictionaryController";

const router = express.Router();

router.post("/createGame", (req,res)=>{
    const { size, time, usePerTurnTimer } = req.body;
    console.log(roomList)
    // usePerTurnTimer ? time = time for each turn : time = time for whole game
    let initialWord = getFirstWord(size);
    let roomName = generateRoomName();
    // send to roomList also generated gamegrid
    roomList.set(roomName,{users: []});
    res.send({code: roomName})
})

function generateRoomName(): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // Check if the generated room name already exists in roomList
    if (roomList.has(result)) {
        // If it exists, recursively call generateRoomName until a unique name is generated
        return generateRoomName();
    }
    return result;
}

export default router;