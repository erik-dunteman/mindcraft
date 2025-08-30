import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Simple in-memory storage for the current plan
let currentPlan: string | null = null;

export const scratchpadTool = createTool({
  id: "scratch-pad-tool",
  description: "Use this to create and store your execution plan before taking actions. Always call this first when given a task to break it down into specific steps. Include what tools you'll use and in what order.",
  inputSchema: z.object({
    task: z.string().describe("The main task you need to accomplish"),
    plan: z.string().describe("Your step-by-step plan with numbered steps, including which tools you'll use"),
  }),
  outputSchema: z.object({
    task: z.string(),
    plan: z.string(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { task, plan } = context;
    
    // Store the plan for reference
    currentPlan = plan;
    
    console.log(`[PLANNING] Task: ${task}`);
    console.log(`[PLANNING] Plan:\n${plan}`);
    
    return {
      task,
      plan,
      message: `Plan created and stored. Ready to execute the following steps:\n${plan}`,
    };
  },
});

// Export function to get current plan (useful for debugging/monitoring)
export const getCurrentPlan = () => currentPlan;
