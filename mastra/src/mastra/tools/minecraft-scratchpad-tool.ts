import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import { string } from "zod/v4";

export const scratchpadTool = createTool({
  id: "scratch-pad-tool",
  description: "Use this to create your execution plan, always call this before other tools.",
  inputSchema: z.object({
    plan: z.string(),
  }),
  outputSchema: z.object({
  }),
  execute: async ({ }) => {
    return {};
  },
});
