const https = require("https");
const fs = require("fs");
const apiKey = "AIzaSyAvD_icLqyAk5EOVbdwmQEERA5YJRIAIRE";

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
                fs.writeFileSync("models_list_key1.txt", modelNames);
                console.log("OK: models_list_key1.txt");
                console.log(modelNames);
            } else {
                console.log("ERR:", JSON.stringify(json));
            }
        } catch (e) {
            console.error("FAIL:", e.message);
        }
    });
});
req.end();
