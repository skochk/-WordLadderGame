import React, { useEffect, useState } from "react";
import "../../App.css";
export default function Score({
    word,
    isFirstPlayer
}:{
    word: string, 
    isFirstPlayer?: boolean // 0 or 1 
}){
    const [words, setWords] = useState<string[][]>([[],[]]);
    const [totalScores, setTotalScores] = useState<number[]>([0,0])
    useEffect(() => {
        if(word.trim() !== ""){
            setWords(prevWords => {
                const modifyWords = [...prevWords];
                modifyWords[isFirstPlayer ? 0 : 1].push(word!);
                return modifyWords;
            });
        
            setTotalScores(prevScores => {
                const scoreUpdate = [...prevScores];
                scoreUpdate[isFirstPlayer ? 0 : 1] += word.length;
                return scoreUpdate;
            });
            // console.log('render', words)
        }
    }, [word, isFirstPlayer]);

    return (
        <div className ="scoreBoard">
            <div className="wordList">
                <div className="firstPlayer">
                    {words[0].map(word=>(
                        <div className="wordCell">{word} {word.length}</div>    
                    ))}
                </div>
                <div className="secondPlayer">
                    {words[1].map(word=>(
                        <div className="wordCell">{word} {word.length}</div>
                    ))}
                </div>
            </div>

            <div className="scores">
                <div className="firstPlayerScore">
                    {totalScores[0]}
                </div>
                <div className="firstPlayerScore">
                    {totalScores[1]}
                </div>
            </div>
        </div>
    )
}