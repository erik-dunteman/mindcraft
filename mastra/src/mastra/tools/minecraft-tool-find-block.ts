import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import { resolveBlockType, getAvailableGroups } from "./minecraft-block-dictionary";

export const findBlockTool = createTool({
  id: "find-nearest-block",
  description: `Find the nearest block of a specific type or group within a given radius. Supports both specific block names and abstract groups.
  
  Specific examples: 'oak_log', 'stone', 'coal_ore', 'iron_ore', 'dirt'
  Abstract groups: 'logs' (finds any log/tree), 'ores' (finds any ore), 'stone' (finds stone variants)
  
  Available groups: ${getAvailableGroups().join(', ')}`,
  
  inputSchema: z.object({
    blockType: z.string().describe("Block type or group name. Examples: 'oak_log', 'logs', 'trees', 'ores', 'stone', 'dirt'"),
    maxDistance: z.number().optional().default(64).describe("Maximum search radius in blocks (default: 64, max recommended: 256)"),
  }),
  outputSchema: z.object({
    found: z.boolean(),
    blockType: z.string(),
    foundBlockName: z.string().optional(),
    position: z.object({
      x: z.number(),
      y: z.number(), 
      z: z.number(),
    }).optional(),
    distance: z.number().optional(),
    searchedTypes: z.array(z.string()),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { blockType, maxDistance = 64 } = context;
    
    try {
      // Resolve the block type to specific block names
      const targetBlocks = resolveBlockType(blockType);
      
      // Find blocks matching any of the target types
      const foundBlocks = bot.findBlocks({
        matching: (block) => targetBlocks.includes(block.name),
        maxDistance: Math.min(maxDistance, 256), // Cap at 256 for performance
        count: 1, // Only need the nearest one
      });

      if (foundBlocks.length === 0) {
        const searchTypesStr = targetBlocks.length > 1 
          ? `any of: ${targetBlocks.slice(0, 3).join(', ')}${targetBlocks.length > 3 ? '...' : ''}`
          : targetBlocks[0];
          
        return {
          found: false,
          blockType,
          searchedTypes: targetBlocks,
          message: `No blocks found for "${blockType}" (searched for ${searchTypesStr}) within ${maxDistance} blocks`,
        };
      }

      // Get the nearest block position
      const nearestPosition = foundBlocks[0];
      const distance = Math.round(bot.entity.position.distanceTo(nearestPosition) * 100) / 100;
      
      // Get the actual block to find its name
      const actualBlock = bot.blockAt(nearestPosition);
      const foundBlockName = actualBlock?.name || 'unknown';

      return {
        found: true,
        blockType,
        foundBlockName,
        position: {
          x: nearestPosition.x,
          y: nearestPosition.y,
          z: nearestPosition.z,
        },
        distance,
        searchedTypes: targetBlocks,
        message: `Found ${foundBlockName} (${blockType}) at coordinates (${nearestPosition.x}, ${nearestPosition.y}, ${nearestPosition.z}), ${distance} blocks away`,
      };
    } catch (error) {
      return {
        found: false,
        blockType,
        searchedTypes: [],
        message: `Error searching for ${blockType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});