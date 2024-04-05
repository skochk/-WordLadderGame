import express, { Request, Response } from 'express';
import { roomList } from "../index";
import { getFirstWord } from "../controllers/dictionaryController";

const router = express.Router();

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

router.post("/createGame", (req,res)=>{
    console.log(roomList)
    // usePerTurnTimer ? time = time for each turn : time = time for whole game

    let roomName = generateRoomName();
    // send to roomList also generated gamegrid

    // send here inital word, then generate grid on 1st connect
    roomList.set(roomName,{users: [], gameData: req.body});
    res.send({code: roomName})
})

export default router;
