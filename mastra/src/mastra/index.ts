import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { minecraftAgent } from "./agents/minecraft-agent";
import { plannerAgent } from "./agents/planner";
import { workerAgent } from "./agents/worker";

export const mastra = new Mastra({
  workflows: {},
  agents: { minecraftAgent, plannerAgent, workerAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
