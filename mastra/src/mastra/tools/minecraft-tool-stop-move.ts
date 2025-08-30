import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import pathfinderModule from "mineflayer-pathfinder";

const { goals, Movements } = pathfinderModule;

export const stopMoveTool = createTool({
  id: "stop-move",
  description: "Stop the bot from moving",
  inputSchema: z.object({}),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({}) => {
    bot.pathfinder.stop();
    return { message: `Stopped moving` };
  },
});
