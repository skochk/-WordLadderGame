import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import './App.css';
import Playboard from "./gamePage/playboardComponent/playboardWithClasses";
import Score from "./gamePage/scoreComponent/score";
import About from './components/aboutPage/AboutComponent';
import Play from './components/playPage/playComponent';
import Game from './components/gamePage/gameComponent';

// interface FirstWordData {
//   word: string
// }


// function App() {
//   const [initialWord, setInitalWord] = useState<string>("");
//   const [newWordFromPlayer, setNewWordFromPlayer] = useState<string>("");
//   const [isFirstPlayerTurn, setTurn] = useState<boolean>(false) // need to be false in first switch
//   useEffect(()=>{
//     const firstWordFetch = async ()=>{
//       try{
//         const response = await fetch("http://localhost:3001/api/dictionary/getFirstWord/5");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data: FirstWordData = await response.json();
//         setInitalWord(data.word)
//       }catch(err){
//         console.error("error fetching first word", err);
//       }
//     }

//     firstWordFetch();

//   },[]);

//   const handleNewWord = (word:string)=>{
//     setNewWordFromPlayer(word);
//     setTurn(!isFirstPlayerTurn);
//     console.log("handleNewWord", word, "current turn: ", isFirstPlayerTurn);
//   }

//   return (  
//     <div className="App-header">
//       <Playboard 
//         firstWord={initialWord}
//         gridSize={5}
//         onCorrectWord={handleNewWord}
//       />
//       <Score
//         word={newWordFromPlayer}
//         isFirstPlayer={isFirstPlayerTurn}
//       />

//     </div>
//   );
// }

function App(){
  return(
      <Router>
        <div className="basic-colors">
          <nav className="header">
            <Link to="/">HOME</Link>
            <Link to="/play">PLAY</Link>
            <Link to="/about">ABOUT</Link>
          </nav>

          <Routes>
            <Route path="/" /> {/* add here first page */}
            <Route path="/play" Component={Play}/>
            <Route path="/about" Component={About}/>
            <Route path="/game/:gameID" Component={Game}/>
          </Routes>
        </div>
      </Router>
  )
}

export default App;
