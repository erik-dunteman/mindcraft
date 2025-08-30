import { createWorkflow, createStep } from "@mastra/core/workflows";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import mineflayer, { Bot } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { newBotId, getOrCreateBot, deleteBot } from "./bot-lifecycle";
import { z } from "zod";
import { uuid } from "zod/v4";

const state = z.object({
  task: z.string(),
});

const loggedInState = z.object({
  task: z.string(),
  botId: z.number(), // used to lookup active bot clients in botClients
});

const loginBot = createStep({
  id: "login-bot",
  description: "logs bot in",
  inputSchema: state,
  outputSchema: loggedInState,
  execute: async ({ inputData }) => {
    const botId = newBotId();
    console.log("creating bot", botId);
    await getOrCreateBot(botId); // ensure the bot is logged in during this step
    console.log("logged in bot", botId);
    return {
      task: inputData.task,
      botId: botId,
    };
  },
});

const agent = createStep({
  id: "agent",
  description: "runs agent",
  inputSchema: loggedInState,
  outputSchema: loggedInState,
  execute: async ({ inputData }) => {
    const agent = new Agent({
      name: "Sub Agent",
      instructions: `You are a helpful assistant that can help with tasks.`,
      model: openai("gpt-4o-mini"),
   tools:
    });
    const result = await agent.generate(inputData.task);
    console.log(result);
    return inputData;
  },
});

const logoutBot = createStep({
  id: "logout-bot",
  description: "logs bot out",
  inputSchema: loggedInState,
  outputSchema: state,
  execute: async ({ inputData }) => {
    const { botId } = inputData;
    console.log("logging out bot", botId);
    await deleteBot(botId);
    console.log("logged out bot", botId);
    return {
      task: inputData.task,
    };
  },
});

export const testWorkflow = createWorkflow({
  id: "test-workflow",
  inputSchema: state,
  outputSchema: state,
})
  .then(loginBot)
  .then(agent)
  .then(logoutBot)
  .commit();
