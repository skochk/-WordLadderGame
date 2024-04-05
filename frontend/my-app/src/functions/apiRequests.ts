import axios from "axios";
import { PlayboardClass } from '../classes/gameClass';

let playboardClass = new PlayboardClass();
const url = "http://localhost:3001";


type wordCheckResponse = {
    result: boolean
}


const getInitialWord = async(length : number)=>{
    try{
        let response = await axios.get(`${url}/api/dictionary/getFirstWord/${length}`);
        return response.data.word;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

const wordCheckOnExisting = async(word: string)=>{
    try{
        let response  = await axios.post<wordCheckResponse>(`http://localhost:3001/api/dictionary/checkWord`,
            {
                word
            });
        return response.data.result;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

const createGame = async(gridSize: number, turnTime: number, usePerTurnTimer: boolean)=>{
    let initWord = await getInitialWord(gridSize);
    let generatedSettings = playboardClass.generateGame(gridSize, initWord, turnTime, usePerTurnTimer);
    console.log('res of class:', generatedSettings);

    try{
        let response = await axios.post(url+"/api/game",{
            settings: generatedSettings
        });
        console.log('response', response);
        return response.data.response;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

export {
    getInitialWord,
    wordCheckOnExisting,
    createGame
};