import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import pathfinderModule from 'mineflayer-pathfinder';

const { goals } = pathfinderModule;
const { Movements } = pathfinderModule;

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
    
    //Grab mc data
    const mcData = require('minecraft-data')(bot.version);

    //Movements
    const customMoves = new Movements(bot);

    //Allow building upwards with these blocks
    customMoves.canDig = true;
    customMoves.allow1by1towers = true;
    customMoves.scafoldingBlocks = [
      mcData.itemsByName.stone.id,
      mcData.itemsByName.dirt.id,
      mcData.itemsByName.cobblestone.id,
    ];

    bot.pathfinder.setMovements(customMoves);

    bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));

    return { message: `Moving (and building if needed) to: ${x}, ${y}, ${z}` };
  },
});
