import React, {useEffect, useState} from 'react';
import './App.css';
import Playboard from "./gamePage/playboardComponent/playboardWithClasses";
import Score from "./gamePage/scoreComponent/score";


interface FirstWordData {
  word: string
}


function App() {
  const [initialWord, setInitalWord] = useState<string>("");
  const [newWordFromPlayer, setNewWordFromPlayer] = useState<string | null>(null);
  
  
  useEffect(()=>{
    const firstWordFetch = async ()=>{
      try{
        const response = await fetch("http://localhost:3001/api/getFirstWord");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: FirstWordData = await response.json();
        setInitalWord(data.word)
      }catch(err){
        console.error("error fetching first word", err);
      }
    }

    firstWordFetch();

  },[]);

  const handleNewWord = (word:string)=>{
    console.log("handleNewWord", word);
    setNewWordFromPlayer(word);
  }

  return (  
    <div className="App-header">
      <Playboard 
        firstWord={initialWord}
        gridSize={5}
        onCorrectWord={handleNewWord}
      />
      <Score
        
      />

    </div>
  );
}

export default App;
