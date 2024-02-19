import React, {useEffect, useState} from 'react';
import '../App.css';
import Cell from "./boardCell/cell";
import cell from './boardCell/cell';

export default function Playboard({
    firstWord,
    gridSize
}:{
    firstWord: string,
    gridSize: number
}){

    const [wordsGrid, setWordsGrid] = useState<string[]>(
        Array.from({length:gridSize*gridSize}).map((el)=> "")
    )
    const [waitingInputCellFromUser, setWaitingInputCellFromUser] = useState<number | null>(null);
    const [lastInput, setLastInput] = useState<number | null>(null); // need this in case if user want to change entered letter or change cell
    const [isWordSelecting, setIsWordSelecting] = useState<boolean>(false);
    const [selectedWordFromUser, setSelectedWordFromUser] = useState<number[]>([]);

    //initial word add to state, calculation position first word in grid depending grid size
    //Should i move it to different place?
    const startIndex = (gridSize * gridSize - gridSize)/2;
    let wordsGridWithFirstWord = wordsGrid;
    for(let i = 0; i<firstWord.length; i++){
        wordsGridWithFirstWord[i+startIndex] = firstWord[i]; // why this changed state?
    }
    // setWordsGrid(wordsGridWithFirstWord); // max rerenders call


    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
        console.log('sevent', event)
        if (waitingInputCellFromUser !== null && /^[a-zA-Z]$/.test(event.key)) {
            const updatedWordsGrid = [...wordsGrid];
            if(lastInput) updatedWordsGrid[lastInput] = "";
            updatedWordsGrid[waitingInputCellFromUser] = event.key.toUpperCase();
            setWordsGrid(updatedWordsGrid);
            setWaitingInputCellFromUser(null);
            setLastInput(waitingInputCellFromUser);
        }
    };


    const onMouseDownHandler = (cellIndex: number) =>{
        // console.log("cellindex",cellIndex, 'lastInput index:', lastInput);
        if(wordsGrid[cellIndex] == "" || cellIndex == lastInput){   
            setWaitingInputCellFromUser(cellIndex);
            setSelectedWordFromUser([]);
        }

        if(wordsGrid[cellIndex] !== "" && lastInput !== null){
            setIsWordSelecting(true);
            setWaitingInputCellFromUser(null);
            setSelectedWordFromUser([cellIndex]);
        }

    }

    const mouseOnCellEnter = (cellIndex: number)=>{
        // console.log("mouseOnCellEnter", cellIndex, "isWordSelecting",isWordSelecting, "lastInput",lastInput);
        if(isWordSelecting && wordsGrid[cellIndex] !== ""){
            setSelectedWordFromUser([...selectedWordFromUser,cellIndex])
        }
    }

    return <div>
        <div 
            className='playground'
            onMouseUp={()=>setIsWordSelecting(false)}
            onMouseLeave={()=>setIsWordSelecting(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {Array.from({length:gridSize*gridSize}).map((el, index)=>(
                <Cell
                    letter={wordsGrid[index]} 
                    index={index}
                    isSelected={selectedWordFromUser.includes(index)}
                    isWaitingInput={waitingInputCellFromUser === index}
                    onMouseDown={()=>onMouseDownHandler(index)}
                    onMouseEnter={()=>mouseOnCellEnter(index)}
                    
                />
            ))}
        </div>
        <p>{selectedWordFromUser}</p>
    </div>
}