const https = require("https");
const fs = require("fs");
const path = require("path");
const apiKey = "AIzaSyDKn3QmTzoSrKCYMJ9N-ErZq2adSAiCP2E";

const options = {
    hostname: "generativelanguage.googleapis.com",
    path: `/v1/models?key=${apiKey}`,
    method: "GET",
};

const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });
    res.on("end", () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const modelNames = json.models.map((m) => m.name).join("\n");
                fs.writeFileSync(path.join(__dirname, "models_final.txt"), modelNames);
                console.log("Full model list saved to models_final.txt");
            } else {
                console.log("No models found or error response:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error("Failed to parse response:", e.message);
        }
    });
});

req.on("error", (error) => {
    console.error("Request error:", error.message);
});

req.end();
