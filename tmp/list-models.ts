import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function listModels() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct listModels in the high-level SDK easily accessible without a fetch, 
        // but we can try to initialize one and see if it fails.
        // Or we can use the fetch API directly.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("Available Models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

listModels();
