import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";


export const attackTool = createTool({
  id: "attack-nearest-mob",
  description: "Attack the nearest mob",
  inputSchema: z.object({}),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async () => {
    console.log("Attempting to find a nearby mob...");

    const allEntities = Object.values(bot.entities).filter(
      (entity) => entity.position.distanceTo(bot.entity.position) < 16 && entity !== bot.entity
    );

    console.log(`Found ${allEntities.length} entities nearby:`);
    allEntities.forEach((entity) => {
      console.log(`- ${entity.displayName} (type: ${entity.type})`);
    });

    const mob = bot.nearestEntity(
      (entity) =>
        entity.type === "hostile" &&
        entity.position.distanceTo(bot.entity.position) < 16
    );

    if (mob) {
      console.log(`Found mob: ${mob.displayName}, starting attack.`);
      bot.attack(mob);
      return { message: `Attacking ${mob.displayName}` };
    } else {
      console.log("No hostile mobs found nearby.");
      return { message: "No mobs nearby to attack." };
    }
  },
});
