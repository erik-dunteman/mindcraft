import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { worldTool } from "../tools/minecraft-tool-world";
import { moveTool } from "../tools/minecraft-tool-move";
import { locationTool } from "../tools/minecraft-get-location";
import { findBlockTool } from "../tools/minecraft-tool-find-block";
import { stopMoveTool } from "../tools/minecraft-tool-stop-move";

export const workerAgent = new Agent({
  name: "Worker Agent",
  instructions: `
    You are an assistant to a manger who will assign you tasks. You are responsible for executing all tasks, in order.
    The move tool is executed async, monitor its status with the locationTool. Use the stopMoveTool if the character seems stuck.
`,
  model: openai("gpt-4o-mini"),
  tools: { worldTool, findBlockTool, moveTool, stopMoveTool, locationTool },
});
