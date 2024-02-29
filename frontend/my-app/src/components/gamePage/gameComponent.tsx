
import React, {useEffect, useState,} from 'react';
import { useParams } from 'react-router-dom';
import Playboard from './playboardComponent/playboardWithClasses';
import { PlayboardClass } from '../../classes/gameClass';
import  {getInitialWord} from "../../functions/apiRequests";
import "../../App.css";
import "./../../App.css"

let pboard = new PlayboardClass();


function Game(){
    const [initalWord, setInitialWord] = useState<string>("")
    let { gameID } = useParams();

    useEffect(()=>{
        const getFirstWord = async()=>{
            let word = await getInitialWord();
            await setInitialWord(word);
            await pboard.generateGrid(5,word);
        }
        getFirstWord();
        console.log("pboard after generate", pboard)

    },[]);


    return(
        <div className='basic'>
            <div className="container">
                {gameID === "onThisDevice" ? 

                <div>
                    <Playboard
                        playboardController={pboard}
                    
                    />
                </div>
                
                
                : <>write logic</>}
            </div>
        </div>
    )
}

export default Game;