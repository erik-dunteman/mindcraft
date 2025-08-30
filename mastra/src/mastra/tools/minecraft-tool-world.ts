import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";

export const worldTool = createTool({
  id: "list-nearby-entities",
  description:
    "List all entities within a radius. Defaults to 0-16 blocks. Prefer smaller radii if possible, and increase the search until you find the target.",
  inputSchema: z.object({
    minRadiusFilter: z.number().default(0),
    maxRadiusFilter: z.number().default(16),
  }),
  outputSchema: z.object({
    entities: z.array(
      z.object({
        type: z.string(),
        name: z.string(),
        position: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const { minRadiusFilter, maxRadiusFilter } = context;
    let entities = Object.values(bot.entities)
      .filter(
        (entity) =>
          entity.position.distanceTo(bot.entity.position) < maxRadiusFilter &&
          entity.position.distanceTo(bot.entity.position) > minRadiusFilter &&
          entity !== bot.entity
      )
      .map((entity) => ({
        type: entity.type,
        name: entity.displayName || "",
        position: entity.position.toString(),
      }));
    return { entities };
  },
});
