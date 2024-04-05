"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWord = exports.getFirstWord = void 0;
// controllers/gameController.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dictionaryFilePath = path_1.default.join(__dirname, '../dictionary.txt');
const dictionaryData = fs_1.default.readFileSync(dictionaryFilePath, 'utf-8');
const dictionary = dictionaryData.split('\n').map(word => word.trim());
function getFirstWord(length) {
    const filteredWords = dictionary.filter(word => word.length === length);
    return filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)] : null;
}
exports.getFirstWord = getFirstWord;
function checkWord(word) {
    return dictionary.includes(word.toUpperCase());
}
exports.checkWord = checkWord;
