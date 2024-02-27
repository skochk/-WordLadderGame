import React, {useEffect, useState} from 'react';
import '../../App.css';
import Cell from "./boardCell/cell";
import { wordBuildFromArray } from '../../functions/wordBuildFromArray';
import { PlayboardClass } from '../../classes/gameClass';

let pboard = new PlayboardClass();

export default function Playboard({
    firstWord,
    gridSize,
    onCorrectWord
}:{
    firstWord: string,
    gridSize: number,
    onCorrectWord: (word: string) => void;
}){
    const [wordsGrid, setWordsGrid] = useState<string[][] | null>(pboard.getGameGrid());
    const [lastInput, setLastInput] = useState<{x: number, y: number} | null>(null); // need this in case if user want to change entered letter or change cell
    const [cellWaitingInputFromUser, setWaitingInputCellFromUser] = useState<{x: number, y: number} | null>(null)
    const [isWordSelecting, setIsWordSelecting] = useState<boolean>(false);
    const [selectedWordFromUser, setSelectedWordFromUser] = useState<number[][]>([]);
    const [notification, setNotificaton] = useState<string>("")

    useEffect(()=>{
        if(firstWord.length){
            pboard.generateGrid(gridSize, firstWord);
            setWordsGrid(pboard.getGameGrid());
        }
    },[firstWord]);

    useEffect(()=>{
        (async()=>{   
            if(!isWordSelecting && selectedWordFromUser.length && wordsGrid){
                let res = await pboard.wordValidation();
                // console.log('res msg',res);
                if(res.status) onCorrectWord(res.word);
                setNotificaton(res.message);
            }
        })()

    },[isWordSelecting])


    pboard.onUpdate(() => {
        // console.log('onUpdate',pboard.getGameGrid(), 'last input',pboard.getLastInput(), "pboard.getSelectedWord()", pboard.getSelectedWord());
        let updState = [...pboard.getGameGrid()];
        setWordsGrid(updState);
        setLastInput(pboard.getLastInput());
        setSelectedWordFromUser(pboard.getSelectedWord());
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
        if (cellWaitingInputFromUser !== null && /^[a-zA-Z]$/.test(event.key)) {
            pboard.addLetterToGameGrid(event.key,{x: cellWaitingInputFromUser.x ,y: cellWaitingInputFromUser.y})
            setWaitingInputCellFromUser(null);
        }
    };

    const onMouseDownHandler = (x: number, y :number)=>{
        // console.log( "onMouseDownHandler",x,y, lastInput)
        if(wordsGrid && wordsGrid[x][y] == "" || (lastInput && lastInput.x == x && lastInput.y == y)){
            setWaitingInputCellFromUser({x,y});
        }
        
        if(wordsGrid && wordsGrid[x][y] !== "" && lastInput){
            setIsWordSelecting(true);
            pboard.addLetterToSelection({x,y});
        }
  
    }

    const mouseOnCellEnter = (x:number, y: number)=>{
        if(isWordSelecting){
            pboard.addLetterToSelection({x,y})
            setWaitingInputCellFromUser(null);
        }
    }

    return <div>
        <div 
            className='playground'
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onMouseUp={()=>setIsWordSelecting(false)}
        >
        {wordsGrid && wordsGrid[0].map((_, yIndex) => (
            <div className='row-pb' key={yIndex}>
                {wordsGrid.map((row, xIndex) => (
                    <Cell
                        isSelected={selectedWordFromUser.some(el=> el[0] == xIndex && el[1] == yIndex)}
                        isWaitingInput={cellWaitingInputFromUser ? cellWaitingInputFromUser.x === xIndex && cellWaitingInputFromUser.y === yIndex : false}
                        key={xIndex}
                        onMouseDown={() => onMouseDownHandler(xIndex, yIndex)}
                        onMouseEnter={()=>mouseOnCellEnter(xIndex,yIndex)}
                        letter={row[yIndex]}
                    />
                ))}
            </div>
        ))}
        </div>
        <p>Selected word {wordsGrid && wordBuildFromArray(wordsGrid, selectedWordFromUser)}</p>
        <p>{notification}</p>
    </div>
}