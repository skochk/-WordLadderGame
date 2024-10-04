import React, { createContext, useContext, useState } from 'react';

interface State {
  // Define your state interface here
  gameGrid: string[][],
  wordsList: string[][],
  selectedWord: number[][],
  lastInput: {x:number, y:number} | null,
  turnTime: number,
  playerTurn: number, 
  isGameActive: boolean,
  turnTimeLeft: [number, number],
  notification: string,
  playersScore: [number, number],
  winner: number
}

interface StateContextType {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}


interface StateProviderProps {
  children: React.ReactNode;
}

const initialState: State = {
  gameGrid: [[]],
  wordsList: [[], [], []],
  selectedWord: [],
  lastInput: null,
  turnTime: 0, 
  playerTurn: 0, 
  isGameActive: false,
  turnTimeLeft: [0,0],
  notification: "",
  playersScore: [0,0],
  winner: 3,
};


const StateContext = createContext<StateContextType | undefined>(undefined);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};

export default function StateProvider ({ children }:StateProviderProps){
  const [state, setState] = useState<State>(initialState);

  return (
    <StateContext.Provider 
      value={{
        state,
        setState
      }}
    >
      {children}
    </StateContext.Provider>
  );
};