import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";

const options = {
  host: "localhost", // Change this to the ip you want.
  port: 25565, // Change this to the port you want.
  username: "Bot",
  auth: "offline",
};

const bot = mineflayer.createBot(options);

bot.once("login", () => {
  console.log("[mc] Logged in as", bot.username);
});

bot.once("spawn", () => {
  console.log("[mc] Spawned into the world");
  mineflayerViewer(bot, { port: 3000, firstPerson: false });
});

bot.on("kicked", (reason, loggedIn) => {
  console.error("[mc] Kicked:", reason, { loggedIn });
});

bot.on("error", (err) => {
  console.error("[mc] Error:", err);
});
