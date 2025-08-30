import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const workerAgentTool = createTool({
  id: "worker-agent-tool",
  description:
    "Send a worker agent to complete a task. midLevel task is what is accomplished by executing each step in order. taskContext is the context about the current state of the environment, such as player position in absolute coordinates, inventory, etc. steps is an array of steps to be executed in order.",
  inputSchema: z.object({
    midLevelTask: z.string(),
    taskContext: z.string(),
    steps: z.array(z.string()),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const { midLevelTask, taskContext, steps } = context;
    const agent = mastra!.getAgent("workerAgent");
    const response = await agent!.generate(
      [
        {
          role: "user",
          content: `Your goal is to complete the following task: ${midLevelTask}. Here is the context: ${taskContext}. Here are the steps to complete the task: ${steps.join("\n")}. Please complete the task in the most efficient way possible.`,
        },
      ],
      {
        maxSteps: 20,
      }
    );
    return { summary: response.text };
  },
});
