import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function testAI() {
    const apiKey = "AIzaSyAvD_icLqyAk5EOVbdwmQEERA5YJRIAIRE";
    console.log("API Key Excerpt:", apiKey?.substring(0, 6), "...", apiKey?.substring((apiKey?.length || 0) - 4));

    const google = createGoogleGenerativeAI({
        apiKey: apiKey
    });

    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-pro"];

    for (const model of models) {
        console.log(`\nTesting model: ${model}...`);
        try {
            const { text } = await generateText({
                model: google(model),
                prompt: "Say hello",
            });
            console.log(`SUCCESS [${model}]:`, text);
            return; // Stop at first success
        } catch (err: any) {
            console.log(`FAILED [${model}]:`, err.message || err);
        }
    }
}

testAI();
