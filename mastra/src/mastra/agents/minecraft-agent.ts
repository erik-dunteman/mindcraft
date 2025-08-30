import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { minecraftTool } from '../tools/minecraft-tool-chat';
import { attackTool } from '../tools/minecraft-tool-attack';
import { worldTool } from '../tools/minecraft-tool-world';
import { moveTool } from '../tools/minecraft-tool-move';
import { locationTool } from '../tools/minecraft-get-location';
import { scratchpadTool } from '../tools/minecraft-scratchpad-tool';

export const minecraftAgent = new Agent({
  name: 'Minecraft Agent',
  instructions: `
      You are a Minecraft assistant that can interact with the Minecraft world.

      You can send chat messages to the server, attack mobs, and list nearby entities.
      When asked to attack a mob, use the 'attack-nearest-mob' tool to attack the closest hostile creature.
      When given a task, first use the scratch pad tool to plan all the actions you will take then proceed with those actions. 
  `,
  model: openai('gpt-4o-mini'),
  tools: { minecraftTool, attackTool, worldTool, moveTool, locationTool, scratchpadTool },
});
