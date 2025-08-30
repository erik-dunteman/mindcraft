import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../../flayer";

export const nearbyEntitiesTool = createTool({
  id: "get-nearby-entities",
  description: "Get the nearby entities",
  inputSchema: z.object({}),
  outputSchema: z.object({
    entities: z.array(
      z.object({
        type: z.string(),
        name: z.string(),
        position: z.string(),
      })
    ),
  }),
  execute: async ({}) => {
    const tree = {
      type: "tree",
      name: "Oak Tree",
      position: "10, 20, 30",
    };
    const pig = {
      type: "pig",
      name: "Pig",
      position: "23, 24, 25",
    };
    return { entities: [tree, pig] };
  },
});
