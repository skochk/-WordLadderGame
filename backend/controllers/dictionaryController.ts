// controllers/gameController.ts
import fs from 'fs';
import path from 'path';

const dictionaryFilePath = path.join(__dirname, '../dictionary.txt');
const dictionaryData = fs.readFileSync(dictionaryFilePath, 'utf-8');
const dictionary: string[] = dictionaryData.split('\n').map(word => word.trim());

export function getFirstWord(length: number): string | null {
    const filteredWords = dictionary.filter(word => word.length === length);
    return filteredWords.length > 0 ? filteredWords[Math.floor(Math.random() * filteredWords.length)] : null;
}

export function checkWord(word: string): boolean {
    return dictionary.includes(word.toUpperCase());
}
