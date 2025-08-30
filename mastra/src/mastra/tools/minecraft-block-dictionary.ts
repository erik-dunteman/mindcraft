/**
 * Abstract block dictionary for Minecraft block types and groups
 * This allows finding blocks by abstract concepts like "logs", "ores", etc.
 */

// All log and stem types in Minecraft (as of 1.21+)
export const LOG_TYPES = [
  'oak_log',
  'spruce_log', 
  'birch_log',
  'jungle_log',
  'acacia_log',
  'dark_oak_log',
  'mangrove_log',
  'cherry_log',
  'pale_oak_log',
  'crimson_stem',    // Nether "log"
  'warped_stem'      // Nether "log"
] as const;

// Common ore types for mining
export const ORE_TYPES = [
  'coal_ore',
  'iron_ore',
  'copper_ore',
  'gold_ore',
  'diamond_ore',
  'emerald_ore',
  'lapis_ore',
  'redstone_ore',
  'deepslate_coal_ore',
  'deepslate_iron_ore',
  'deepslate_copper_ore',
  'deepslate_gold_ore',
  'deepslate_diamond_ore',
  'deepslate_emerald_ore',
  'deepslate_lapis_ore',
  'deepslate_redstone_ore',
  'nether_gold_ore',
  'nether_quartz_ore'
] as const;

// Stone types for building
export const STONE_TYPES = [
  'stone',
  'cobblestone',
  'deepslate',
  'cobbled_deepslate',
  'granite',
  'diorite',
  'andesite',
  'calcite',
  'tuff',
  'basalt',
  'blackstone'
] as const;

// Food-related blocks
export const CROP_TYPES = [
  'wheat',
  'carrots',
  'potatoes',
  'beetroots',
  'sweet_berry_bush',
  'melon',
  'pumpkin',
  'cocoa'
] as const;

// Abstract block groups mapping
export const BLOCK_GROUPS = {
  // Tree-related
  'logs': LOG_TYPES,
  'trees': LOG_TYPES,
  'wood': LOG_TYPES,
  
  // Mining-related  
  'ores': ORE_TYPES,
  'ore': ORE_TYPES,
  
  // Building materials
  'stone': STONE_TYPES,
  'stones': STONE_TYPES,
  
  // Food/farming
  'crops': CROP_TYPES,
  'food': CROP_TYPES,
  
  // Common single blocks (for convenience)
  'dirt': ['dirt'],
  'grass': ['grass_block'],
  'sand': ['sand'],
  'gravel': ['gravel'],
  'water': ['water'],
  'lava': ['lava']
} as const;

export type BlockGroupName = keyof typeof BLOCK_GROUPS;

/**
 * Resolves a block type string to an array of specific block names
 * @param blockType - Either a specific block name or an abstract group name
 * @returns Array of specific block names to search for
 */
export function resolveBlockType(blockType: string): string[] {
  // Check if it's an abstract group first
  const normalizedType = blockType.toLowerCase() as BlockGroupName;
  if (BLOCK_GROUPS[normalizedType]) {
    return [...BLOCK_GROUPS[normalizedType]];
  }
  
  // Otherwise treat as specific block name
  return [blockType];
}

/**
 * Gets all available abstract block group names
 */
export function getAvailableGroups(): string[] {
  return Object.keys(BLOCK_GROUPS);
}

/**
 * Gets information about what blocks are in a group
 */
export function getGroupContents(groupName: string): string[] | null {
  const normalizedGroup = groupName.toLowerCase() as BlockGroupName;
  if (BLOCK_GROUPS[normalizedGroup]) {
    return [...BLOCK_GROUPS[normalizedGroup]];
  }
  return null;
}