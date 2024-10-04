import React, {useEffect, useState} from 'react';
import "./../../../../App.css";
import { useStateContext } from '../../context/stateContext';

export default function Cell({
    letter,
    isSelected,
    onMouseDown,
    // index,
    isWaitingInput,
    onMouseEnter

}:{
    letter: string,
    isSelected?: boolean,
    isWaitingInput?: boolean,
    onMouseDown: () => void,
    // index: number,
    onMouseEnter: () => void
}){
    const {state,setState} = useStateContext();
    return(
        <div
            className={`cell ${isSelected ? "selected" : ""} ${isWaitingInput ? "waiting-input" : ""}`}
            onMouseDown={state.isGameActive ? onMouseDown : undefined}
            onMouseEnter={state.isGameActive ? onMouseEnter : undefined}
        >
            {letter.toUpperCase()}
        </div>
    )
}