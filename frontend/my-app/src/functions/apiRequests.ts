import axios from "axios";

const url = "http://localhost:3001";


type wordCheckResponse = {
    result: boolean
}


const getInitialWord = async()=>{
    try{
        let response = await axios.get(`${url}/api/dictionary/getFirstWord/5`);
        return response.data.word;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

const wordCheckOnExisting = async(word: string)=>{
    try{
        let response  = await axios.post<wordCheckResponse>(`http://localhost:3001/api/dictionary/checkWord`,
            {
                word
            });
        return response.data.result;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

export {
    getInitialWord,
    wordCheckOnExisting
};