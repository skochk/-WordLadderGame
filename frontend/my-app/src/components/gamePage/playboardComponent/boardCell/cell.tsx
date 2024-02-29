import React, {useEffect, useState} from 'react';
import "./../../../../App.css";

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
    return(
        <div
            className={`cell ${isSelected ? "selected" : ""} ${isWaitingInput ? "waiting-input" : ""}`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
        >
            {letter.toUpperCase()}
        </div>
    )
}