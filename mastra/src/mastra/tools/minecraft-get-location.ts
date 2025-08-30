import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import pathfinderModule from 'mineflayer-pathfinder';

const { goals } = pathfinderModule;

export const locationTool = createTool({
  id: "get-location",
  description: "Get the bot's location",
  inputSchema: z.object({}),
  outputSchema: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  execute: async ({ }) => {

    const position = bot.entity.position;
    return { x:position.x, y:position.y, z:position.z};
  },
});
