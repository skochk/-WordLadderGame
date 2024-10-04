import { stat } from "fs";
import { wordCheckOnExisting } from "../functions/apiRequests";
import { wordBuildFromArray } from '../functions/wordBuildFromArray';


class PlayboardClass{
    private gameGrid: string[][];
    private wordList: string[][]; // [[],[],[]];  0,1 = for players, 2 = initial word
    private selectedWord: number[][];
    private lastInput: {x:number, y:number} | null;
    private playerTurn: number; // 0 = first, 1 = second player turn
    private turnTime: number; // in seconds
    private isGameActive: boolean;
    private usePerTurnTimer: boolean; 
    private turnTimeLeft: [number, number];
    private notification: string;
    private playersScore: [number, number];
    private winner: number; // 0, 1, 2 = Draw, 3 = game still going
    private updateCallback: (() => void) | null = null;
    

    public constructor(){
        this.gameGrid = [[]];
        this.wordList = [[],[],[]]; 
        this.selectedWord = [];
        this.lastInput = null;
        this.playerTurn = 0;
        this.turnTime = 0;
        this.turnTimeLeft = [0,0];
        this.isGameActive = false;
        this.usePerTurnTimer = true;
        this.notification = "";
        this.playersScore = [0,0];
        this.winner = 3;
        console.log("constructor this.gameGrid", JSON.stringify(this.gameGrid));
    }
    
    public generateGrid(gridSize: number, initialWord: string, turnTime: number, usePerTurnTimer: boolean){
        this.gameGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
        // this.gameGrid[0][1] = "A";
        // this.gameGrid[1][1] = "b";
        // this.gameGrid[1][2] = "C";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        this.gameGrid[(gridSize-1)/2] = initialWord.toUpperCase().split("");
        this.wordList[2] = [initialWord];
        this.turnTime = turnTime;
        this.turnTimeLeft = [turnTime, turnTime];
        this.usePerTurnTimer = usePerTurnTimer;
        //cleanup after restart
        this.playersScore = [0,0];
        this.winner = 3;
        this.playerTurn = 0;
        this.notification = "";
        this.wordList[0] = [];
        this.wordList[1] = [];
        // console.log('class generateGrid', initialWord, this.gameGrid)
        this.callUpdateCallback();
    }

    private callUpdateCallback() {
        if (this.updateCallback) {
            this.updateCallback();
        }
    }
     // Method to register callback for updates
    onUpdate(callback: () => void) {
        this.updateCallback = callback;
    }

    public getGameGrid(): string[][]{
        return [...this.gameGrid];
    }

    public getLastInput(): {x:number, y:number} | null{
        return this.lastInput;
    }

    public getSelectedWord(): number[][]{
        return [...this.selectedWord];
    }
    
    public getWordList(): string[][]{
        return [...this.wordList]; // prevent mutability?
    }
    
    public addLetterToSelection(currentIndex: {x:number, y:number}){
        if(!this.selectedWord.length && this.gameGrid[currentIndex.x][currentIndex.y] !== ""){
            this.selectedWord = [[currentIndex.x,currentIndex.y]];
            // console.log("set first selected letter", this.selectedWord);
            this.callUpdateCallback();
            return;
        }
        if(!this.lastInput) return;

        let neighboursCellIndex = [
            [currentIndex.x-1,currentIndex.y],
            [currentIndex.x+1,currentIndex.y],
            [currentIndex.x,currentIndex.y-1],
            [currentIndex.x,currentIndex.y+1],
        ];

        let isCurrentCellAreNeighbour = neighboursCellIndex.some(el=> el[0] == this.selectedWord[this.selectedWord.length-1][0] && el[1] == this.selectedWord[this.selectedWord.length-1][1]);
        if(isCurrentCellAreNeighbour && this.gameGrid[currentIndex.x][currentIndex.y] !== ""){
            this.selectedWord.push([currentIndex.x,currentIndex.y]);
        }

        // if cursor went on previously selected cells = unselect last selected until current
        if(this.selectedWord.some(el=> el[0] == currentIndex.x && el[1] == currentIndex.y)){
            let index = this.selectedWord.findIndex(elemArray => elemArray[0] == currentIndex.x && elemArray[1] == currentIndex.y);
            this.selectedWord = this.selectedWord.slice(0, index + 1);  
        }

        this.callUpdateCallback();
    }

    public async wordValidation(){
        // if(this.lastInput !== null){ //ask Nikita about this types number | null, maybe i use typescript wrong)) now i used ! in lastInput
        let wordInStringFormat = wordBuildFromArray(this.gameGrid,this.selectedWord);
        console.log('word validationm wordslist', this.wordList);
        let IsWordUsed = this.wordList.some(array => array.includes(wordInStringFormat.toUpperCase()));
        let isNewLetterUsed = this.selectedWord.some(el=> el[0] == this.lastInput!.x && el[1]== this.lastInput!.y)
        this.selectedWord = [];
        this.callUpdateCallback();

        if (IsWordUsed || !isNewLetterUsed) {
            this.notification = IsWordUsed ? "This word already used" : "Entered letter was not used";
            return;
        }
    
        let isExistOnDictionary = await wordCheckOnExisting(wordInStringFormat);
        
        if(!IsWordUsed && isNewLetterUsed && isExistOnDictionary){
            this.lastInput = null;
            this.wordList[this.playerTurn].push(wordInStringFormat);
            this.playersScore[this.playerTurn] += wordInStringFormat.length; 
            this.checkIsGameStillActive();
            this.callUpdateCallback();
        }

        if(this.isGameActive){
            let message = isExistOnDictionary ? `Word ${wordInStringFormat} is correct!` : `Word ${wordInStringFormat} does not exist in the dictionary`;
            this.notification = message;

        }
        // return { status: isExistOnDictionary, message, word : wordInStringFormat }; 
        
    }
    

    public addLetterToGameGrid(letter: string, position:{x: number, y:number}){
        // console.log('addLetterToGameGrid', letter, position, "this.lastInput", this.lastInput);
        if(this.gameGrid[position.x][position.y] == "" || (this.lastInput && position.x == this.lastInput.x && position.y == this.lastInput.y)){
            if(this.lastInput){
                this.gameGrid[this.lastInput.x][this.lastInput.y] = '';
            }
            this.gameGrid[position.x][position.y] = letter.toUpperCase();
          
            this.lastInput = {x: position.x, y: position.y};
        }
        this.callUpdateCallback();
    }

    // public setTimeLeftForRound(){
    //     return ""
    // }

    public getCurrentGameState(){

        return {
            gameGrid: this.gameGrid,
            wordsList: this.wordList,
            selectedWord: this.selectedWord,
            lastInput: this.lastInput,
            turnTime: this.turnTime,
            isGameActive: this.isGameActive,
            playerTurn: this.playerTurn,
            turnTimeLeft: this.turnTimeLeft,
            notification: this.notification,
            playersScore: this.playersScore,
            winner: this.winner
        };
    }

    // public getTurnTime(){
    //     return this.turnTime;
    // }

    // public getIsGameActive(){
    //     return this.isGameActive;
    // }

    // public getPlayerTurn(){
    //     return this.playerTurn;
    // }
    // public getTturnTimeLeft(){
    //     return this.turnTimeLeft;
    // }


    public setGameState(gameGrid: string[][],wordList: string[][], playerTurn: number, isGameActive: boolean){
        this.gameGrid = gameGrid;
        this.wordList = wordList;
        this.playerTurn = playerTurn;
        this.isGameActive = isGameActive;
    }

  

    public generateGame(gridSize: number, initialWord: string, turnTime: number, usePerTurnTimer: boolean){
        this.gameGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
        this.gameGrid[(gridSize-1)/2] = initialWord.toUpperCase().split("");
        this.wordList[2] = [initialWord];
        this.turnTime = turnTime;
        this.usePerTurnTimer = usePerTurnTimer;
        
        this.callUpdateCallback();

        return this.getCurrentGameState();   
    }


    public startGame() {
        if (this.isGameActive) {
            console.log("Game already started.");
            return;
        }
    
        this.isGameActive = true;
        this.playerTurn = 0;
        this.turnTimeLeft = [this.turnTime, this.turnTime]; // Initial, same both modes 

    
        this.runTurnTimer(); // Start the timer
        this.callUpdateCallback();
    }
    
    private runTurnTimer() {
        if (!this.isGameActive) return;
    
        if (this.usePerTurnTimer) {
            this.runPerTurnTimer(); // Use per-turn timer logic
        } else {
            this.runOverallPlayerTimers(); // Track both players' remaining time
        }
    }
    
    private runPerTurnTimer() {
        console.log(`Player ${this.playerTurn + 1}'s turn started. Time: ${this.turnTime} seconds`);
    
        let intervalId = setInterval(() => {
            if (this.turnTimeLeft[this.playerTurn] > 0) {
                this.turnTimeLeft[this.playerTurn]--;
                this.callUpdateCallback(); // Update UI with remaining time for the current player
            } else {
                clearInterval(intervalId);
                this.switchPlayerTurn();
    
                if (this.isGameActive) {
                    this.turnTimeLeft[this.playerTurn] = this.turnTime; // Reset the timer for the new player
                    this.runPerTurnTimer(); // Start timer for the next player's turn
                }
            }
        }, 1000);
    }
    
    private runOverallPlayerTimers() {
        console.log(`Game timer started for both players. Each player has ${this.turnTime} seconds`);
    
        let intervalId = setInterval(() => {
            if (this.turnTimeLeft[this.playerTurn] > 0) {
                this.turnTimeLeft[this.playerTurn]--;
                this.callUpdateCallback(); 
            } else {
                clearInterval(intervalId); 
                this.isGameActive = false;
                this.winner = 1 - this.playerTurn;
                this.notification = `Player ${this.winner + 1} won by time!`;
                console.log('this.notfi winner', this.winner, this.notification)
                this.callUpdateCallback();
            }
        }, 1000);
    }
    
    private switchPlayerTurn() {
        console.log('call swtich')
        this.playerTurn = 1 - this.playerTurn; 
        console.log(`Player ${this.playerTurn + 1}'s turn.`);
        this.callUpdateCallback();
    }
    


    private checkIsGameStillActive(){
        console.log('checkler is game active', !this.gameGrid.flat().every(cell => cell !== ''))
        //add here checker is possible to build new word existing in dictionary
        this.isGameActive = !this.gameGrid.flat().every(cell => cell !== '');
        if(this.isGameActive){
            this.switchPlayerTurn();
            if(this.usePerTurnTimer){
               this.turnTimeLeft = [this.turnTime, this.turnTime];
               this.callUpdateCallback();
            }
        }else{
            console.log('select winner')
            this.turnTimeLeft = [0,0];
            let msg = "";
            if(this.playersScore[0] == this.playersScore[1]){
                msg = 'Draw!';
                this.winner = 2;
            }
            if(this.playersScore[0] > this.playersScore[1]){
                msg = "Player 1 won!";
                this.winner = 0;
            }else{
                msg = "Player 2 won!"
                this.winner = 1;
            }
            console.log('final msg', msg)
            this.notification = msg;
            this.callUpdateCallback();
        }
        this.callUpdateCallback();
    }
    

}

export { PlayboardClass }