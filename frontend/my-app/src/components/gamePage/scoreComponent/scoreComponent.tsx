import React, {useEffect, useState,} from 'react';
import { useStateContext } from '../context/stateContext';

function Score(){
    const {state} = useStateContext();
    return(
        <div className='scoreTable'>
            <div 
                className="playerScore"
                style={{backgroundColor: state.winner == 0 ? "#8ac88a" : 
                    (state.playerTurn === 0 && state.isGameActive ? "#22262e" : "#2e323a")
                }}
            >
                <div className="timer">
                    Time: {state.turnTimeLeft[0]}
                </div>

                <p>Words:</p>
                {
                    state.wordsList[0].map(word=>(
                        <div className="word">{word} {word.length}</div>
                    ))
                }
                <div className="totalScore">Total score: {state.playersScore[0]}</div>
            </div>
            
            <div 
                className="playerScore"
                style={{ backgroundColor: state.winner == 1 ? "#8ac88a" : 
                    (state.playerTurn === 1 && state.isGameActive ? "#22262e" : "#2e323a")}}
            >
                <div className="timer">
                    Time: {state.turnTimeLeft[1]}
                </div>
                <p>Words:</p>
                {
                    state.wordsList[1].map(word=>(
                        <div className="word">{word} {word.length}</div>
                    ))
                }
                <div className="totalScore">Total score: {state.playersScore[1]}</div>

            </div>
        </div>
    )
}

export default Score;