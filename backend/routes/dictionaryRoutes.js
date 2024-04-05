"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dictionaryController_1 = require("../controllers/dictionaryController");
const router = express_1.default.Router();
// Route to check if a word exists in the dictionary
router.post('/checkWord', (req, res) => {
    const { word } = req.body;
    if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const result = (0, dictionaryController_1.checkWord)(word);
    res.json({ result });
});
// Route to get a random word with a specific length
router.get('/getFirstWord/:length', (req, res) => {
    const { length } = req.params;
    const word = (0, dictionaryController_1.getFirstWord)(parseInt(length));
    if (word) {
        res.json({ word });
    }
    else {
        res.status(404).json({ error: 'No words found with the specified length' });
    }
});
exports.default = router;
