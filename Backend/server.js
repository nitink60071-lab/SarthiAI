import express from "express";
import "dotenv/config";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with database!");
    } catch(err) {
        console.log("Failed to connect with database!", err);
    }
}

/* app.post("/test", async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: req.body.message || "Hello!"
        });

        //console.log(response.text);  //reply

        res.json( response.text );
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});   */