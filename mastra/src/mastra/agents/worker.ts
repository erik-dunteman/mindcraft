import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { worldTool } from "../tools/minecraft-tool-world";
import { moveTool } from "../tools/minecraft-tool-move";
import { locationTool } from "../tools/minecraft-get-location";

export const workerAgent = new Agent({
  name: "Worker Agent",
  instructions: `
    You are an assistant to a manger who will assign you tasks. You are responsible for executing all tasks, in order. 
`,
  model: openai("gpt-4o-mini"),
  tools: { worldTool, moveTool, locationTool },
});
