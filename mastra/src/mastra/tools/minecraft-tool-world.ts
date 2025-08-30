import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";

export const worldTool = createTool({
  id: "list-nearby-entities",
  description: "List all entities and blocks within a 16 block radius",
  inputSchema: z.object({}),
  outputSchema: z.object({
    entities: z.array(z.object({
      type: z.string(),
      name: z.string(),
      position: z.string(),
    })),
  }),
  execute: async () => {
    const entities = Object.values(bot.entities)
      .filter((entity) => entity.position.distanceTo(bot.entity.position) < 16 && entity !== bot.entity)
      .map((entity) => ({
        type: entity.type,
        name: entity.displayName || "",
        position: entity.position.toString(),
      }));

    return { entities };
  },
});
