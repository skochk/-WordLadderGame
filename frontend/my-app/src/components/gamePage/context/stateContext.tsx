import React, { createContext, useContext, useState } from 'react';

interface State {
  // Define your state interface here
  gameGrid: string[][],
  wordsList: string[][],
  selectedWord: number[][],
  lastInput: {x:number, y:number} | null,
}

interface StateContextType {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}


interface StateProviderProps {
  children: React.ReactNode;
}

const initialState: State = {
  gameGrid: [['a','b','']],
  wordsList: [[], [], ['asd']],
  selectedWord: [],
  lastInput: null,
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