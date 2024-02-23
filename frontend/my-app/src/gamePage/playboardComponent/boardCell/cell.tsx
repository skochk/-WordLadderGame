import React, {useEffect, useState} from 'react';
import '../../../App.css';

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
    onMouseDown: () => void,
    // index: number,
    isWaitingInput?: boolean,
    onMouseEnter: () => void
    // onInput: (input:string) => void
}){
    return(
        <div
            className={`cell ${isSelected ? "selected" : ""} ${isWaitingInput ? "waiting-input" : ""}`}
            onMouseDown={onMouseDown}
            // data-key-attribute={index}
            onMouseEnter={onMouseEnter}
        >
            {letter.toUpperCase()}
        </div>
    )
}