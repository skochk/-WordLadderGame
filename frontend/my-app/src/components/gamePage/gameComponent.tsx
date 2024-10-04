
import React, {useEffect, useState, useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Playboard from './playboardComponent/playboardWithClasses';
import Score from "./scoreComponent/scoreComponent";
import { PlayboardClass } from '../../classes/gameClass';
import  {getInitialWord} from "../../functions/apiRequests";
import "../../App.css";
import "./../../App.css"
import { useStateContext } from './context/stateContext';

let pboard = new PlayboardClass();


function Game(){
    const [initalWord, setInitialWord] = useState<string>("");
    const [isFirstGamePlayed, setIsFirstGamePlayed] = useState(false);
    let { gameID } = useParams();
    const { state, setState } = useStateContext();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);


    const socketRef = useRef<WebSocket | null>(null);

    const getFirstWord = async(gridSize : number, turnTime: number, usePerTurnTimer: boolean)=>{
        let word = await getInitialWord(gridSize);
        console.log('init word', word)
        await setInitialWord(word);
        await pboard.generateGrid(gridSize,word,turnTime, usePerTurnTimer);
    }
    useEffect(()=>{
        console.log("asd",gameID)
        if(gameID == "onThisDevice"){
            let gridSize = Number(queryParams.get("gridSize")) || 5;
            let turnTime = Number(queryParams.get("time"));
            // Convert to boolean from string this param
            let usePerTurnTimer: boolean; 
            const usePerTurnTimerStr = queryParams.get("usePerTurnTimer"); 
            // Convert to boolean
            usePerTurnTimer = usePerTurnTimerStr === 'true'; // Converting

            pboard.generateGrid(gridSize,' '.repeat(gridSize),turnTime, usePerTurnTimer);
            

            console.log("pboard after generate", pboard);

        }else{
            console.log('connecting to sockets, room: ',gameID)
            socketRef.current = new WebSocket('ws://localhost:3001');

            socketRef.current.onopen = () => {
              console.log('WebSocket connection established');
              socketRef.current?.send(JSON.stringify({ type: 'joinRoom', roomId: gameID }));
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            socketRef.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'gameUpdate') {
                  console.log('Received game data:', message.data);
                  // Handle received game data
                //   pboard.setGameState()
                }
            };
        }

    },[]);

    const handleStartGame = ()=> {
        console.log("handleStartGame",)
        if(!isFirstGamePlayed) setIsFirstGamePlayed(true);
        let gridSize = Number(queryParams.get("gridSize")) || 5;
        let turnTime = Number(queryParams.get("time"));
        // Convert to boolean from string this param
        let usePerTurnTimer: boolean; 
        const usePerTurnTimerStr = queryParams.get("usePerTurnTimer"); 
        // Convert to boolean
        usePerTurnTimer = usePerTurnTimerStr === 'true'; // Converting
    
        getFirstWord(gridSize, turnTime, usePerTurnTimer);
        
        console.log("pboard after generate", pboard);
        pboard.startGame();
        
    }

    pboard.onUpdate(() => {
      
      setState(prevState => {
        return{
            ...prevState,
            ...pboard.getCurrentGameState()
        }
      });
    });
    


    return(
        <div className='basic'>
            <div className="container">
                {/* {gameID === "onThisDevice" ?  */}
                
                <div className='gamePage'>
                    <Playboard
                        playboardController={pboard}
                    />
                    <Score/>
                
                </div>
                <div
                    className='startButton'
                    onClick={()=>handleStartGame()}
                >
                    { isFirstGamePlayed ? "Restart" : "Start"}
                </div>
                
                {/* : <>write logic</>} */}
            </div>
        </div>
    )
}

export default Game;