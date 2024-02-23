

const wordBuildFromArray = (gridArray: string[][], wordArray: number[][])=>{
    let word = '';
    wordArray.forEach(([x, y]) => {
        word += gridArray[x][y];
    });
    return word;
}

export { wordBuildFromArray };