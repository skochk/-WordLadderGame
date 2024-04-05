"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const dictionaryController_1 = require("../controllers/dictionaryController");
const router = express_1.default.Router();
router.post("/createGame", (req, res) => {
    const { size, time, usePerTurnTimer } = req.body;
    console.log(index_1.roomList);
    // usePerTurnTimer ? time = time for each turn : time = time for whole game
    let initialWord = (0, dictionaryController_1.getFirstWord)(size);
    let roomName = generateRoomName();
    // send to roomList also generated gamegrid
    // send here inital word, then generate grid on 1st connect
    index_1.roomList.set(roomName, { users: [] });
    res.send({ code: roomName });
});
function generateRoomName() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // Check if the generated room name already exists in roomList
    if (index_1.roomList.has(result)) {
        // If it exists, recursively call generateRoomName until a unique name is generated
        return generateRoomName();
    }
    return result;
}
exports.default = router;
