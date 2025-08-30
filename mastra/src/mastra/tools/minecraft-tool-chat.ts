import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { sendChatMessage } from "../../flayer";

export const minecraftTool = createTool({
  id: "send-minecraft-chat",
  description: "Send a chat message to the Minecraft server",
  inputSchema: z.object({
    message: z.string().describe("The message to send"),
  }),
  outputSchema: z.object({}),
  execute: async ({ context }) => {
    sendChatMessage(context.message);
    return {};
  },
});
