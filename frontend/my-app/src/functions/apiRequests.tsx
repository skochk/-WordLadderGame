import axios from "axios";

const url = "http://localhost:3001";


type wordCheckResponse = {
    result: boolean
}

const wordCheckOnExisting = async(word: string)=>{
    try{
        let response  = await axios.post(`http://localhost:3001/api/wordCheck`,
            {
                word: word
            });
            // console.log(response.data);
        return response.data.result;
    }catch(err){
        console.log('axios err', err);
        throw err;
    }
}

export {
    wordCheckOnExisting
};