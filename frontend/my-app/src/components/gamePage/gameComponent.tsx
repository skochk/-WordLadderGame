
import React, {useEffect, useState,} from 'react';
import { useParams } from 'react-router-dom';
import Playboard from './playboardComponent/playboardWithClasses';
import Score from "./scoreComponent/scoreComponent";
import { PlayboardClass } from '../../classes/gameClass';
import  {getInitialWord} from "../../functions/apiRequests";
import "../../App.css";
import "./../../App.css"
import { useStateContext } from './context/stateContext';

let pboard = new PlayboardClass();


function Game(){
    const [initalWord, setInitialWord] = useState<string>("")
    let { gameID } = useParams();
    const { state, setState } = useStateContext();

    
    useEffect(()=>{
        const getFirstWord = async()=>{
            let word = await getInitialWord();
            await setInitialWord(word);
            await pboard.generateGrid(5,word);
        }
        // 
        // if gameID = load game    
        getFirstWord();
        console.log("pboard after generate", pboard)

    },[]);

    pboard.onUpdate(() => {
      setState(prevState => {
        return{
            ...prevState,
            gameGrid: pboard.getGameGrid(),
            wordsList: pboard.getWordList(),
            selectedWord: pboard.getSelectedWord(),
            lastInput: pboard.getLastInput()
        }
      });
    });
    

    


    return(
        <div className='basic'>
            <div className="container">
                {gameID === "onThisDevice" ? 
                
                <div>
                    <Playboard
                        playboardController={pboard}
                    />
                    <Score/>

                </div>
                
                
                : <>write logic</>}
            </div>
        </div>
    )
}

export default Game;