import "../../App.css";


function GameSetup(){ 
    return(
        <div className={["basic",'gameSetup'].join(" ")}>
            <div className="container"> {/* find solution to use container for all pages automatically */}
                <h1>select mode:</h1>
                <div className="selection">
                    <div className="mode"><a href='/game/onThisDevice'>Play on this device together with friend</a></div>
                    <div className="mode">Play with friend by link</div>
                </div>

            </div>
        
        
        </div>
    )
}

export default GameSetup;