const { createInterface } = require('readline');
const { Configuration, OpenAIApi } = require('openai');

const CHAT_MODEL = 'gpt-3.5-turbo';
const DEFAULT_SYSTEM_INPUT = 'You are a helpful assistant.';
const SYSTEM_PROMPT = 'SYSTEM > ';
const USER_PROMPT = 'YOU > ';
const BOT_PROMPT = 'BOT > ';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
  const systemInput = await readUserInput(SYSTEM_PROMPT) || DEFAULT_SYSTEM_INPUT;
  const messages = [
    { 'role': 'system', 'content': systemInput },
  ];

  while (true) {
    const userInput = await readUserInput(USER_PROMPT);
    messages.push({
      role: 'user',
      content: userInput,
    });
    const res = await openai.createChatCompletion({
      model: CHAT_MODEL,
      messages,
    });
    const { message } = res.data.choices[0];
    console.log(BOT_PROMPT);
    console.log(message.content);
    messages.push(message);
  }
}

async function readUserInput(query) {
  const i = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    i.question(query, resolve);
  }).finally(() => i.close());
}

main().catch(console.error);
