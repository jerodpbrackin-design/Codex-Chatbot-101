import promptSync from "prompt-sync";
import dotenv from "dotenv";
// const dotenv = require("dotenv");
dotenv.config();

const apiAccount = process.env.API_CLOUDFLARE_ACCT_ID;
const apiToken = process.env.API_CLOUDFLARE_TOKEN;
const apiModelCFare = process.env.API_CLOUDFLARE_MODEL;

if (!apiAccount || !apiToken || !apiModelCFare) {
  throw new Error("Missing Cloudflare API env vars");
}

const prompt = promptSync();

async function run() {
  while (true) {
    const userInput = prompt("Ask anything (or 'exit' to quit): ");
    if (!userInput) continue;
    if (userInput.toLowerCase() === "exit") break;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${apiAccount}/ai/run/${apiModelCFare}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: userInput }],
        }),
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      continue;
    }

    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  }
}

export default run;

// If this file is executed directly, start the prompt loop.
run().catch((err) => console.error(err));
