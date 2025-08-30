import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";

const blockTypeNames = [
  "diamond_ore",
  "iron_ore",
  "coal_ore",
  "gold_ore",
  "emerald_ore",
  "lapis_ore",
  "redstone_ore",
  "netherite_block",
  "ancient_debris",
  "copper_ore",
  "raw_iron",
  "raw_gold",
  "raw_copper",
  "raw_emerald",
  "raw_lapis",
  "raw_redstone",
  "raw_netherite",
  "raw_diamond",
  "raw_iron",
  "raw_gold",
  "raw_copper",
  "raw_emerald",
  "raw_lapis",
  "raw_redstone",
  "raw_netherite",
  "raw_diamond",
  "raw_iron",
  "raw_gold",
  "raw_copper",
  "raw_emerald",
  "raw_lapis",
  "raw_redstone",
  "raw_netherite",
  "raw_diamond",
  "raw_iron",
  "raw_gold",
  "raw_copper",
  "raw_emerald",
  "raw_lapis",
  "raw_redstone",
  "raw_netherite",
  "raw_diamond",
  "raw_iron",
];

export const worldTool = createTool({
  id: "list-nearby-blocks",
  description:
    "List all blocks within a radius. Defaults to 0-16 blocks. Prefer smaller radii if possible, and increase the search until you find the target.",
  inputSchema: z.object({
    minRadiusFilter: z.number().default(0),
    maxRadiusFilter: z.number().default(16),
    blockType: z.string(),
  }),
  outputSchema: z.object({
    blocks: z.array(
      z.object({
        type: z.string(),
        name: z.string(),
        position: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const { minRadiusFilter, maxRadiusFilter, blockType } = context;
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
