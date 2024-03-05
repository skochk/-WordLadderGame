import React, {useEffect, useState,} from 'react';
import { useStateContext } from '../context/stateContext';

function Score(){
    const {state} = useStateContext();
    return(
        <div className='scoreTable'>
            <div className="playerScore">
                <p>Words:</p>
                {
                    state.wordsList[0].map(word=>(
                        <div className="word">{word} {word.length}</div>
                    ))
                }
                <div className="totalScore">Total score: {state.wordsList[0].reduce((acc,current)=>acc+current.length,0)}</div>
            </div>
            
            <div className="playerScore">
                <p>Words:</p>
                {
                    state.wordsList[1].map(word=>(
                        <div className="word">{word} {word.length}</div>
                    ))
                }
                <div className="totalScore">Total score: {state.wordsList[1].reduce((acc,current)=>acc+current.length,0)}</div>

            </div>
        </div>
    )
}

export default Score;