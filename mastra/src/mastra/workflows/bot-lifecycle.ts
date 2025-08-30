import { createWorkflow, createStep } from "@mastra/core/workflows";
import mineflayer, { Bot } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { z } from "zod";
import { uuid } from "zod/v4";

// we can't serialize the Bot type for passing between steps
// so we need to keep it in a global singleton map

const bots: Map<number, Bot> = new Map();

export const getOrCreateBot = async (id: number): Promise<Bot> => {
  if (bots.get(id)) {
    return bots.get(id)!;
  }
  const bot = await createBot();
  bots.set(id, bot);
  return bot;
};

var botId: number = 0; // increment ID as needed
export const newBotId = (): number => {
  const original = botId;
  botId = botId + 1; //
  return original;
};

const createBot = async (): Promise<Bot> => {
  // Log bot in
  const options = {
    host: "localhost",
    port: 25565,
    username: "Bot",
    auth: "offline" as const,
  };

  const bot = mineflayer.createBot(options);

  // await spawn
  await new Promise<void>((resolve) => {
    bot.once("spawn", () => {
      console.log("spawned");
      resolve();
    });
  });

  return bot;
};

export const deleteBot = (id: number) => {
  if (bots.get(id)) {
    const bot = bots.get(id)!;
    bot.quit();
  }
};
