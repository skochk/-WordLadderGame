import "../../App.css";
import { useState } from "react";
import { createGame } from "../../functions/apiRequests";


interface GridSize {
    title: string;
    size: number;
  }
  
const gridSize: GridSize[] = [
    {
        title: '3x3',
        size: 3,
    },
    {
        title: '5x5',
        size: 5,
    },
    {
        title: '7x7',
        size: 7,
    },
];

function GameSetup(){ 
    const [selectedSize, setSelectedSize] = useState<number>(gridSize[1].size);
    const [usePerTurnTimer, setUsePerTurnTimer]=useState<boolean>(true);
    const [time, setTime]= useState<string>("120");

    async function handleGameCreateClick(){
        console.log("handle click: ")
        let res = await createGame(selectedSize, Number(time), usePerTurnTimer)
        
    }

    return(
        <div className={["basic",'gameSetup'].join(" ")}>
            <div className="container"> {/* find solution to use container for all pages automatically */}
                <h1>select mode:</h1>
                <div className="settings">
                    {gridSize.map((el,idx)=>(
                        <div
                            onClick={()=>setSelectedSize(el.size)}   
                            key={idx}
                            className={selectedSize == el.size ? "size-selected" : "size"}
                        >
                            {el.title}
                        </div>
                    ))}
                </div>
                
                <div className={["settings", "timer"].join(" ")}>
                    <div className="minutes">
                        <p>{Number(time)/60}</p>
                        <p>Minutes</p>
                    </div>
                    <input
                        type="range"
                        min="30"
                        max="600"
                        step="30"
                        value={time}
                        className="slider"
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>

                <div className="settings">
                    <div 
                        className={usePerTurnTimer ? "size-selected" : "size"}
                        onClick={()=>setUsePerTurnTimer(true)}
                    >
                        Per Turn Timer Mode
                    </div>

                    <div
                        className={!usePerTurnTimer ? "size-selected" : "size"}
                        onClick={()=>setUsePerTurnTimer(false)}
                    >
                        Overall Game Timer Mode
                    </div>
                </div>

                <div className="selection">
                    <div className="mode">
                        <a href={`/game/onThisDevice?gridSize=${selectedSize}&time=${time}&usePerTurnTimer=${usePerTurnTimer}`}>
                            Play on this device together with friend
                        </a>
                    </div>
                    <div className="mode" onClick={()=> handleGameCreateClick()}>Play with friend by link</div>
                </div>

            </div>
        
        
        </div>
    )
}

export default GameSetup;