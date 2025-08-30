import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { screenshot } from "../../chromium";
import fs from "fs";
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";

// Mastra doesn't accept images in tool responses, so we call a completely separate model to do the image processing
// and summarize it
const imageModel = new Agent({
  name: "Image Model",
  instructions: `
    You are the eyes of a minecraft bot. 

    You'll be given a screenshot of the bot's first person view, and you need to describe the scene, and extract all the text in the image. 

    This description will be used for autonomous navigation, so include only information that is necessary for navigation.

    The caller already knows:
    - this is a minecraft world
    - the bot is in first person view

    Do not include any other details like textures, colors, etc.
    Concise, to the point, and do not include any unnecessary details.

    Instead of:
    "There are several large trees with dense green foliage. The trunks are brown and thick, indicating they are mature trees.".
    Say: 
    "There are several large trees, brown trunks, green foliage."

    Instead of:
    "The landscape features more trees, with some birch trees visible due to their white bark. There are patches of open ground and small water bodies, likely streams or ponds."
    Say: 
    "Birch trees are visible, with visible water bodies."

    Instead of:
    "The sky is clear and light blue, indicating daytime."
    Say: 
    "It's daytime"

    You may also be asked to answer specific questions. As with all observations, keep answers concise and to the point.

    When describing an entity, include the entity's name, type, and position within the screenshot by x,y coordinates. The screenshot is 1280x720 pixels.
    To avoid confusion with the world's vec3 coordinates, always describe coordinates as "pixels (x, y) in the first person viewport.

    Lastly, always include a situational description of where the player is. Is it in a room, on a tree, underground, being attacked, etc. Three sentences max.
    `,
  model: openai("gpt-4o-mini"),
  tools: {},
});

export const screenshotTool = createTool({
  id: "screenshot-tool",
  description:
    "Use this to take a screenshot from the first person point of view of the bot",
  inputSchema: z.object({
    questions: z
      .string()
      .optional()
      .describe(
        "The questions you want to ask about the image. They should be specific to the image, and not general questions like 'what is in the image?'"
      ),
  }),
  outputSchema: z.object({
    image: z.string(),
  }),
  execute: async ({ context }) => {
    const { questions = "(none)" } = context;
    const imagePath = await screenshot();
    if (!imagePath) {
      return {
        image: "Failed to screenshot",
      };
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await imageModel.generate([
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:image/png;base64,${base64Image}`,
            mimeType: "image/jpeg",
          },
          {
            type: "text",
            text: `
            "Perform your image description task, and then answer the following questions: ${questions}"
            `,
          },
        ],
      },
    ]);

    return {
      image: response.text,
    };
  },
});
