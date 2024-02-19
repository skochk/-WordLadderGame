import React, {useEffect, useState} from 'react';
import './App.css';
import Playboard from "./gamePage/playboard";


interface FirstWordData {
  word: string
}

function App() {
  const [initialWord, setInitalWord] = useState<string>("");
  
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

  return (  
    <div className="App-header">
      <Playboard firstWord={initialWord} gridSize={5}/>
    </div>
  );
}

export default App;
