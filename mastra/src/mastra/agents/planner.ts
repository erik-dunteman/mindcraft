import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { workerAgentTool } from "../tools/subagents/worker-agent-tool";
import { scratchpadTool } from "../tools/minecraft-scratchpad-tool";
import { worldTool } from "../tools/minecraft-tool-world";
import { locationTool } from "../tools/minecraft-get-location";

// planner uses exclusively read tools to build up a spec for the next actions to take
// the spec is then passed to the runner
export const plannerAgent = new Agent({
  name: "Planner Agent",
  instructions: `
      You are a helpful manager who is tasked to send a worker agent to complete a high level task in minecraft.
      
      Your job is the following:
      - Use the scratchpad tool to decompose the high level task into a series of mid-level tasks
      - For each mid-level task, prepare a spec for the worker to complete the task. That spec may contain multiple smaller steps to be executed in sequence.
      - Send the worker agent to complete the mid-level task
      - Reassess your progress using the read tools, and update the scratchpad tool with your new plan
      - Loop until the high-level task is complete

      Your spec to the worker should be a spec of the following format:
      <Goal>
        {Brief description of the high level goal.}
      </Goal>
      <Context>
        {Context about the current state of the environment, such as player position in absolute coordinates, inventory, etc.}
      </Context>
      <Steps>
      - Step 1: {Description of the first step, such as "walk to the tree", it is at coordinates x, y, z}
      - Step 2: {Description of the second step, such as "chop the tree"}
      - Step 3: {Description of the third step, such as "gather the wood"}
      </Steps>

`,
  model: openai("gpt-4o-mini"),
  tools: {
    worldTool,
    locationTool,
    workerAgentTool,
    scratchpadTool,
  },
});
