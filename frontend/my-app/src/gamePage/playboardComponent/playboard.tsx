import React, {useEffect, useState} from 'react';
import '../../App.css';
import Cell from "./boardCell/cell";
import { wordBuildFromArray } from '../../functions/wordBuildFromArray';
import { wordCheckOnExisting } from "../../functions/apiRequests";


export default function Playboard({
    firstWord,
    gridSize,
    onCorrectWord
}:{
    firstWord: string,
    gridSize: number,
    onCorrectWord: (word: string) => void;
}){

    const [wordsGrid, setWordsGrid] = useState<string[]>(
        Array.from({length:gridSize*gridSize}).map((el)=> "")
    )
    wordsGrid[0] = "A"
    wordsGrid[1] = "B"
    wordsGrid[2] = "C"
    wordsGrid[3] = "D"
    wordsGrid[4] = "E"
    wordsGrid[5] = "F"
    wordsGrid[6] = "G"
    wordsGrid[7] = "E"
    wordsGrid[8] = "F"
    wordsGrid[9] = "G"

    const [waitingInputCellFromUser, setWaitingInputCellFromUser] = useState<number | null>(null);
    const [lastInput, setLastInput] = useState<number | null>(null); // need this in case if user want to change entered letter or change cell
    const [isWordSelecting, setIsWordSelecting] = useState<boolean>(false);
    const [selectedWordFromUser, setSelectedWordFromUser] = useState<number[]>([]);

    //initial word add to state, calculation position first word in grid depending grid size
    //Should i move it to different place?
    const startIndex = (gridSize * gridSize - gridSize)/2;
    let wordsGridWithFirstWord = wordsGrid;
    for(let i = 0; i<firstWord.length; i++){
        wordsGridWithFirstWord[i+startIndex] = firstWord[i].toUpperCase(); // why this changed state?
    }
   
    // setWordsGrid(wordsGridWithFirstWord); // max rerenders call


    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
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

        if(isWordSelecting && wordsGrid[cellIndex] !== "" && !selectedWordFromUser.includes(cellIndex)){
            setSelectedWordFromUser([...selectedWordFromUser,cellIndex])
        }
        if(wordsGrid[cellIndex] == "" || selectedWordFromUser.includes(cellIndex)){
            // setIsWordSelecting(false);
        }

        if(selectedWordFromUser[selectedWordFromUser.length -1] == cellIndex){
            console.log('Deleted last element')
            setSelectedWordFromUser(selectedWordFromUser.splice(-1))
        }
        
        console.log(selectedWordFromUser, "selectedWordFromUser", cellIndex, "cellIndex")
    }

    useEffect(() => {
        const checkWord = async () => {
            const word = wordBuildFromArray(wordsGrid, selectedWordFromUser);
            const result = await wordCheckOnExisting(word);
            if (result) {
                console.log("Correct word:", word);
                onCorrectWord(word); 
            } else {
                setIsWordSelecting(false);
                console.log("word not exist!")
                let wordsGridRemovedLastInput = [...wordsGrid];
                if(lastInput) wordsGridRemovedLastInput[lastInput] = ''; // ?? if writed only because of lastInput type null capability 
                setWordsGrid(wordsGridRemovedLastInput)
            }
        };

        if (!isWordSelecting && selectedWordFromUser.length && lastInput && selectedWordFromUser.includes(lastInput)) {
            checkWord();
            setIsWordSelecting(false);
            setSelectedWordFromUser([]);
        }
        if(lastInput && !selectedWordFromUser.includes(lastInput) && !isWordSelecting){
            //make alert that new letter wasnt used
            console.log('New letter was not used!');
            setIsWordSelecting(false);
            setSelectedWordFromUser([]);
        }
    }, [isWordSelecting]);


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
        <p>Selected word {wordBuildFromArray(wordsGrid, selectedWordFromUser)}</p>
    </div>
}