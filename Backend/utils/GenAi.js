import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

const getGenAIAPIResponse = async(message) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: message
        });

        return response.text  //reply
    } catch(err) {
        console.log(err);
        //res.status(500).json({ error: "Something went wrong" });
        throw err;
    }
}

export default getGenAIAPIResponse;