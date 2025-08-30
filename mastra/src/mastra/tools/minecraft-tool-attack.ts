import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { bot } from "../../flayer";
import { plugin as pvp } from "mineflayer-pvp";
import { Movements } from "mineflayer-pathfinder";
import pathfinderModule from 'mineflayer-pathfinder';
import { Vec3 } from "vec3";

const { goals } = pathfinderModule;

//VARIABLES
const MAX_WORLD_HEIGHT = 256;

bot.loadPlugin(pvp);

const hostileMobs = [
  "zombie", "skeleton", "creeper", "spider", "enderman", "witch", "slime",
  "phantom", "drowned", "pillager", "hoglin", "zoglin", "blaze", "ghast",
  "magma_cube", "wither_skeleton", "guardian", "elder_guardian", "ravager",
  "vindicator", "evoker", "warden", "cave_spider",
];

//const SAFE_POS = { x: 100, y: 65, z: 100 }; //Set it to a house or base?
let autoFightEnabled = false;
let retreating = false;

//Functions to enable and disable
//Better safe spot function? by openai
function findSafeSpot(): Vec3 {

  const nearbyHostiles = Object.values(bot.entities).filter(
  e => !!e.position && !!e.name && hostileMobs.includes(e.name)
  )

  if (nearbyHostiles.length === 0) return bot.entity.position.clone();

  const nearest = bot.nearestEntity(e => {
    if (!e.name) return false;
    return hostileMobs.includes(e.name);
  });

  if (!nearest || !nearest.position) return bot.entity.position.clone();

  const dx = bot.entity.position.x - nearest.position.x;
  const dz = bot.entity.position.z - nearest.position.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  const scale = 30 / distance; //30 block distance?

  let safeX = bot.entity.position.x + dx * scale;
  let safeZ = bot.entity.position.z + dz * scale;
  let safeY = bot.entity.position.y;

  // Scan upwards to find the first non-solid block (so bot doesn't suffocate)
  while (!bot.blockAt(new Vec3(safeX, safeY, safeZ))?.boundingBox && safeY < MAX_WORLD_HEIGHT) {
    safeY += 1;
  }

  // Or scan downwards if the bot is floating
  while (bot.blockAt(new Vec3(safeX, safeY - 1, safeZ))?.boundingBox === 'empty' && safeY > 0) {
    safeY -= 1;
  }

  console.log(`Safe spot: (${safeX.toFixed(1)}, ${safeY}, ${safeZ.toFixed(1)})`);
  return new Vec3(safeX, safeY, safeZ);
}

function enableAutoFight() {
  if (autoFightEnabled) return;
  autoFightEnabled = true;

  bot.on("physicsTick", autoFightHandler);
  console.log("⚔️ Auto-fight enabled.");
}

function disableAutoFight() {
  if (!autoFightEnabled) return;
  autoFightEnabled = false;

  bot.removeListener("physicsTick", autoFightHandler);
  bot.pvp.stop();
  console.log("🛑 Auto-fight disabled.");
}

//Get current safe spot globally lowkey
let currentSafeSpot: Vec3 | null = null;

function checkHealth(): boolean {
  if (bot.health < 10 && !retreating) {
    currentSafeSpot = findSafeSpot();
    console.log("Low health! Retreating");
    const movements = new Movements(bot);
    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(new goals.GoalNear(currentSafeSpot.x, currentSafeSpot.y, currentSafeSpot.z, 1));
    retreating = true;
    return true;
  }
  return retreating;
}

function reachedSafeSpot(): boolean {
  if (!retreating || !currentSafeSpot) return false;
  const distance = bot.entity.position.distanceTo(currentSafeSpot);
  if (distance < 2) {
    console.log("🏠 Reached safe spot, stopping retreat");
    bot.pathfinder.setGoal(null);
    retreating = false;
    return true;
  }
  return false;
}

function autoFightHandler() {
  if (!autoFightEnabled) return;

  //Retreat if low health
  if (checkHealth()) {
    reachedSafeSpot();
    return;
  }

  console.log("Scanning for mobs...");

  const nearbyEntities = Object.values(bot.entities).filter(
    entity =>
      entity !== bot.entity && //Dont include self
      entity.position &&
      bot.entity.position.distanceTo(entity.position) < 16
  );

  console.log(`Nearby entities (${nearbyEntities.length}):`, nearbyEntities.map(e => e.name ?? e.username ?? e.type));

  if (nearbyEntities.length === 0) {
    if (bot.pvp.target) bot.pvp.stop();
    console.log("✅ No hostiles nearby.");
    return;
  }

  //Pick entity to frag
  const target = bot.nearestEntity(entity =>
  entity !== bot.entity && //Dont include self
  entity.position && //Valid position
  bot.entity.position.distanceTo(entity.position) < 16 && //Less then 16 blocks
  entity.name !== undefined && //Not undefined 
  hostileMobs.includes(entity.name) //In hostile mobs array
);

  if (target) {

    //If hostiles greater then 1 and both health below 15
    if (nearbyEntities.length > 1 && bot.health < 15 && !retreating) {
      console.log("Multiple hostiles, retreating to safe spot");

      //Calculate a safe spot away from nearest hostile
      currentSafeSpot = findSafeSpot();

      // etup pathfinding to that spot
      const movements = new Movements(bot);
      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(new goals.GoalBlock(currentSafeSpot.x, currentSafeSpot.y, currentSafeSpot.z));

      retreating = true; //Mark retreating so it doesn't constantly recalc
    }

    //Attack target
    if (!bot.pvp.target || bot.pvp.target.id !== target.id) {
      console.log(`⚔️ Engaging ${target.name}`);
      bot.pvp.attack(target);
    }
  } else if (bot.pvp.target) {
    console.log("✅ No more hostiles nearby, stopping combat");
    bot.pvp.stop();
  }
}

//Listen for respawn stuff
bot.on("death", () => {
  console.log("💀 Bot died! Clearing goals and stopping combat.");
  retreating = false;
  autoFightEnabled = false;
  currentSafeSpot = null;
  bot.pvp.stop();
  bot.pathfinder.setGoal(null);
});

bot.on("respawn", () => {
  console.log("✨ Bot respawned!");
  //Optional
  enableAutoFight();
});

//Tools
export const startAutoFightTool = createTool({
  id: "start-auto-fight",
  description: "Enable automatic detection and fighting of nearby hostile mobs",
  inputSchema: z.object({}),
  outputSchema: z.object({ message: z.string() }),
  execute: async () => {
    autoFightEnabled = true;
    bot.on("physicsTick", autoFightHandler);
    return { message: "AutoFight enabled." };
  },
});

export const stopAutoFightTool = createTool({
  id: "stop-auto-fight",
  description: "Disable automatic hostile mob fighting",
  inputSchema: z.object({}),
  outputSchema: z.object({ message: z.string() }),
  execute: async () => {
    autoFightEnabled = false;
    retreating = false;
    bot.removeListener("physicsTick", autoFightHandler);
    bot.pvp.stop();
    bot.pathfinder.setGoal(null);
    return { message: "AutoFight disabled." };
  },
});