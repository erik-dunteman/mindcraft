import mineflayer from "mineflayer";
import pathfinderModule from "mineflayer-pathfinder";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { initChromium, screenshot } from "./chromium";

const options = {
  host: "localhost", // Change this to the ip you want.
  port: 25565, // Change this to the port you want.
  username: "Bot",
  auth: "offline" as const,
};

export const bot = mineflayer.createBot(options);

//Destructure stuff because import is stupid
const { pathfinder, Movements, goals } = pathfinderModule;

bot.loadPlugin(pathfinder);

bot.once("login", () => {
  console.log("[mc] Logged in as", bot.username);
});

bot.once("spawn", async () => {
  console.log("[mc] Spawned into the world");
  mineflayerViewer(bot, { port: 3000, firstPerson: true });
  await initChromium();
  console.log("[mc] viewer running at http://localhost:3000");
  await screenshot();

  const defaultMove = new Movements(bot);

  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (message !== "come") return;

    const target = bot.players[username]?.entity;
    if (!target) {
      bot.chat("I don't see you !");
      return;
    }

    const { x: playerX, y: playerY, z: playerZ } = target.position;
    const RANGE_GOAL = 1;

    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(
      new goals.GoalNear(playerX, playerY, playerZ, RANGE_GOAL)
    );
  });
});

bot.on("kicked", (reason, loggedIn) => {
  console.error("[mc] Kicked:", reason, { loggedIn });
});

bot.on("error", (err) => {
  console.error("[mc] Error:", err);
});

export const sendChatMessage = (message: string) => {
  bot.chat(message);
};
