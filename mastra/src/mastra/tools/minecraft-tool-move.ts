import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import pathfinderModule from 'mineflayer-pathfinder';

const { goals } = pathfinderModule;

export const moveTool = createTool({
  id: "move-to-coordinates",
  description: "Move the bot to a specific set of coordinates, these are a absolute set of coordinates, if you want to do a relative move, first call the getLocation tool and calculate relative to that",
  inputSchema: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { x, y, z } = context;
    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
    return { message: `Moving to coordinates: ${x}, ${y}, ${z}` };
  },
});
