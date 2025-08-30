import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../../flayer";

export const botLocationTool = createTool({
  id: "get-bot-location",
  description: "Get the bot's location",
  inputSchema: z.object({}),
  outputSchema: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  execute: async ({}) => {
    return { x: 1, y: 2, z: 3 };
  },
});
