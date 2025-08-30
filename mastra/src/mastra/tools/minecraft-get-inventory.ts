import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";

export const inventoryTool = createTool({
  id: "get-inventory",
  description: "Get the item's in the bot's invetory",
  inputSchema: z.object({}),
  outputSchema: z.object({
    items: z.array(
        z.object({
            name: z.string(),
            count: z.number(), 
            slot: z.number().optional(),
        })
    ),
  }),
  execute: async ({ }) => {

    const items = bot.inventory.items().map((item) => ({
      name: item.name,
      count: item.count,
      slot: item.slot,
    }));

    return {items }
  },
});