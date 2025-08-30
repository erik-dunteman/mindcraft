import { createTool } from "@mastra/core/tools";
import { workerAgent } from "../../agents/worker";
import { z } from "zod";

export const workerAgentTool = createTool({
  id: "worker-agent-tool",
  description:
    "Send a worker agent to complete a task. Fields are 'spec' which is a string of the spec for the worker agent to complete the task.",
  inputSchema: z.object({
    spec: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { spec } = context;
    const response = await workerAgent.generate(
      [{ role: "user", content: spec }],
      {
        maxSteps: 20,
      }
    );
    return { summary: response.text };
  },
});
