

const wordBuildFromArray = (gridArray: string[], wordArray: number[])=>{
    let word = "";
    wordArray.map(element => word+=gridArray[element]);
    return word;
}

export { wordBuildFromArray };