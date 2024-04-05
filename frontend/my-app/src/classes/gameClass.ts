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
    private updateCallback: (() => void) | null = null;

    public constructor(){
        this.gameGrid = [[]];
        this.wordList = [[],[],[]]; 
        this.selectedWord = [];
        this.lastInput = null;
        this.playerTurn = 0;
        this.turnTime = 0;
        this.isGameActive = false;
        this.usePerTurnTimer = true;
        console.log("constructor this.gameGrid", JSON.stringify(this.gameGrid));
    }
    
    public generateGrid(gridSize: number, initialWord: string, turnTime: number){
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
        let isWordNotUsed = !this.wordList.some(array => array.includes(wordInStringFormat.toUpperCase()));
        let isNewLetterUsed = this.selectedWord.some(el=> el[0] == this.lastInput!.x && el[1]== this.lastInput!.y)
        this.selectedWord = [];
        this.callUpdateCallback();

        if (!isWordNotUsed || !isNewLetterUsed) {
            let message = !isWordNotUsed ? "This word already used" : "Entered letter was not used";
            return { status: false, message , word: wordInStringFormat };
        }
    
        let isExistOnDictionary = await wordCheckOnExisting(wordInStringFormat);
        
        if(isWordNotUsed && isNewLetterUsed && isExistOnDictionary){
            this.lastInput = null;
            this.wordList[this.playerTurn].push(wordInStringFormat);
            this.playerTurn = 1 - this.playerTurn;
            console.log('w list', this.wordList);
            this.callUpdateCallback();
        }

        let message = isExistOnDictionary ? `Word ${wordInStringFormat} is correct!` : "Word does not exist in the dictionary";
        return { status: isExistOnDictionary, message, word : wordInStringFormat }; 
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

    public setTimeLeftForRound(){
        return ""
    }

    public getCurrentGameState(){

        return {
            gameGrid: this.gameGrid,
            wordList:this.wordList,
            playerTurn: this.playerTurn,
            turnTime: this.turnTime,
            isGameActive: this.isGameActive,
            usePerTurnTimer: this.usePerTurnTimer
        };
    }

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

}

export { PlayboardClass }