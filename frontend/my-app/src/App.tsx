import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import './App.css';
import About from './components/aboutPage/AboutComponent';
import Play from './components/playPage/playComponent';
import Game from './components/gamePage/gameComponent';

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
