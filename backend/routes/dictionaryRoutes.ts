import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getFirstWord, checkWord } from "../controllers/dictionaryController";
const router = express.Router();

// Route to check if a word exists in the dictionary
router.post('/checkWord', (req, res) => {
    const { word }: { word?: string } = req.body;
    if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const result = checkWord(word);
    res.json({ result });
});

// Route to get a random word with a specific length
router.get('/getFirstWord/:length', (req, res) => {
    const { length } = req.params;
    const word = getFirstWord(parseInt(length));
    if (word) {
        res.json({ word });
    } else {
        res.status(404).json({ error: 'No words found with the specified length' });
    }
});

export default router;