import promptSync from "prompt-sync";
import dotenv from "dotenv";
dotenv.config();

const prompt = promptSync();

const apiAccount = process.env.API_CLOUDFLARE_ACCT_ID;
const apiToken = process.env.API_CLOUDFLARE_TOKEN;
const apiModel = process.env.API_CLOUDFLARE_MODEL;

if (!apiAccount || !apiToken || !apiModel) {
  throw new Error("Missing Cloudflare API env vars");
}

async function run() {
  console.log("\n🟢 Jedi Master Bot initialized.");
  console.log("Type 'parsecs' to leave the Force.\n");

  const messages = [
    {
      role: "system",
      content: `
        You are a wise Jedi Master from Star Wars.
        You speak calmly, with patience and clarity.
        You offer guidance using Jedi philosophy, the Force, and balance.
        You do NOT break character.
        You do NOT mention being an AI.
        `,
    },
  ];

  while (true) {
    const userInput = prompt("Wise you are, ask questions you may...(or 'parsecs' to quit): ");
    const text = userInput?.trim();
    if (!text) continue;
    if (text.toLowerCase() === "parsecs") {
      console.log("\n✨ Jedi Master: The Force will be with you. Always.\n");
      break;
    }

    const confirm = prompt("Press Enter to send, or type 'c' then Enter to cancel: ");
    if (confirm && confirm.trim().toLowerCase() === 'c') {
      console.log('Message cancelled.');
      continue;
    }

    messages.push({ role: "user", content: text });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${apiAccount}/ai/run/${apiModel}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      continue;
    }

    const result = await response.json();
    const reply =
      result?.result?.response ||
      "The Force is unclear… meditate and ask again.";

    console.log(`\n🟣 Jedi Master: ${reply}\n`);

    messages.push({ role: "assistant", content: reply });
  }
}

export default run;

run().catch((err) => console.error(err));
