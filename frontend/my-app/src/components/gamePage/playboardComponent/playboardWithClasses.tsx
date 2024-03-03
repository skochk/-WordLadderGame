import React, {useEffect, useState} from 'react';
import "./../../../App.css";
import Cell from "./boardCell/cell";
import { wordBuildFromArray } from '../../../functions/wordBuildFromArray';
import { PlayboardClass } from '../../../classes/gameClass';
import { useStateContext } from '../context/stateContext';

// let playboardController = new PlayboardClass();

export default function Playboard({
    playboardController
}:{
    playboardController: PlayboardClass
}){
    const {state,setState} = useStateContext();
    console.log('playboard useStateContext() state.gameGrid',state)
    // const [state.gameGrid, setstate.gameGrid] = useState<string[][] | null>(playboardController.getstate.gameGrid());
    // const [state.lastInput, setstate.lastInput] = useState<{x: number, y: number} | null>(null); // need this in case if user want to change entered letter or change cell
    const [cellWaitingInputFromUser, setWaitingInputCellFromUser] = useState<{x: number, y: number} | null>(null)
    const [isWordSelecting, setIsWordSelecting] = useState<boolean>(false);
    // const [state.selectedWord, setstate.selectedWord] = useState<number[][]>([]);
    const [notification, setNotificaton] = useState<string>("")
    
    
    useEffect(()=>{
        (async()=>{   
            if(!isWordSelecting && state.selectedWord.length && state.gameGrid){
                let res = await playboardController.wordValidation();
                // console.log('res msg',res);
                setNotificaton(res.message);
            }
        })()

    },[isWordSelecting])


    //   playboardController.onUpdate(() => {
    //     // console.log('onUpdate',playboardController.getstate.gameGrid(), 'last input',playboardController.getstate.lastInput(), "playboardController.getstate.selectedWord()", playboardController.getstate.selectedWord());
    //     let updState = [...playboardController.getstate.gameGrid()];
    //     setstate.gameGrid(updState);
    //     setstate.lastInput(playboardController.getstate.lastInput());
    //     setstate.selectedWord(playboardController.getstate.selectedWord());
    // });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
        if (cellWaitingInputFromUser !== null && /^[a-zA-Z]$/.test(event.key)) {
            playboardController.addLetterToGameGrid(event.key,{x: cellWaitingInputFromUser.x ,y: cellWaitingInputFromUser.y})
            setWaitingInputCellFromUser(null);
        }
    };

    const onMouseDownHandler = (x: number, y :number)=>{
        // console.log( "onMouseDownHandler",x,y, state.lastInput)
        if(state.gameGrid && state.gameGrid[x][y] == "" || (state.lastInput && state.lastInput.x == x && state.lastInput.y == y)){
            setWaitingInputCellFromUser({x,y});
        }
        
        if(state.gameGrid && state.gameGrid[x][y] !== "" && state.lastInput){
            setIsWordSelecting(true);
            playboardController.addLetterToSelection({x,y});
        }
  
    }

    const mouseOnCellEnter = (x:number, y: number)=>{
        if(isWordSelecting){
            playboardController.addLetterToSelection({x,y})
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
        {state.gameGrid && state.gameGrid[0].map((_, yIndex) => (
            <div className='row-pb' key={yIndex}>
                {state.gameGrid.map((row, xIndex) => (
                    <Cell
                        isSelected={state.selectedWord.some(el=> el[0] == xIndex && el[1] == yIndex)}
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
        <p>Selected word {state.gameGrid && wordBuildFromArray(state.gameGrid, state.selectedWord)}</p>
        <p>{notification}</p>
    </div>
}