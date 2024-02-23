import { wordCheckOnExisting } from "../functions/apiRequests";
import { wordBuildFromArray } from '../functions/wordBuildFromArray';

class PlayboardClass{
    private gameGrid: string[][];
    public wordList: string[];
    public selectedWord: number[][];
    private lastInput: {x:number, y:number} | null;
    private updateCallback: (() => void) | null = null;

    public constructor(){
        this.gameGrid = [[]];
        this.wordList = [];
        this.selectedWord = [];
        this.lastInput = null;
        console.log("constructor this.gameGrid", JSON.stringify(this.gameGrid));
    }
    
    public generateGrid(gridSize: number, initialWord: string){
        this.gameGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
        // this.gameGrid[0][1] = "A";
        // this.gameGrid[1][1] = "b";
        // this.gameGrid[1][2] = "C";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        // this.gameGrid[0][0] = "A";
        this.gameGrid[(gridSize-1)/2] = initialWord.toUpperCase().split("");
        this.wordList = [initialWord];
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
        return this.gameGrid;
    }

    public getLastInput(): {x:number, y:number} | null{
        return this.lastInput;
    }

    public getSelectedWord(): number[][]{
        return this.selectedWord;
    }
    
    public addLetterToSelection(currentIndex: {x:number, y:number}){
        if(!this.selectedWord.length && this.gameGrid[currentIndex.x][currentIndex.y] !== ""){
            this.selectedWord = [[currentIndex.x,currentIndex.y]];
            console.log("set first selected letter", this.selectedWord);
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
        let isWordNotUsed = !this.wordList.includes(wordInStringFormat.toUpperCase());
        let isNewLetterUsed = this.selectedWord.some(el=> el[0] == this.lastInput!.x && el[1]== this.lastInput!.y)
        this.selectedWord = [];
        this.callUpdateCallback();

        if (!isWordNotUsed || !isNewLetterUsed) {
            let message = !isWordNotUsed ? "This word already used" : "Entered letter was not used";
            return { status: false, message };
        }
    
        let isExistOnDictionary = await wordCheckOnExisting(wordInStringFormat);
        
        if(isWordNotUsed && isNewLetterUsed && isExistOnDictionary){
            this.lastInput = null;
            this.callUpdateCallback();
        }

        let message = isExistOnDictionary ? `Word ${isExistOnDictionary} is correct!` : "Word does not exist in the dictionary";
        return { status: isExistOnDictionary, message }; 
    }
    
    public addWordToWordList(word:string){
        this.wordList.push(word);
        this.selectedWord = [];
        this.callUpdateCallback();
        this.lastInput = null;
        console.log("addWordToWordList",this.selectedWord)

    }

    public addLetterToGameGrid(letter: string, position:{x: number, y:number}){
        console.log('addLetterToGameGrid', letter, position, "this.lastInput", this.lastInput);
        if(this.gameGrid[position.x][position.y] == "" || (this.lastInput && position.x == this.lastInput.x && position.y == this.lastInput.y)){
            if(this.lastInput){
                this.gameGrid[this.lastInput.x][this.lastInput.y] = '';
            }
            this.gameGrid[position.x][position.y] = letter.toUpperCase();
          
            this.lastInput = {x: position.x, y: position.y};
        }
        this.callUpdateCallback();
    }

}

export { PlayboardClass }