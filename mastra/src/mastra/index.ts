import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { testWorkflow } from "./workflows/test-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { minecraftAgent } from "./agents/minecraft-agent";
import { planRunWorkflow, singlePlanRunWorkflow } from "./workflows/plan-run";
import { plannerAgent } from "./agents/planner";

export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    testWorkflow,
    planRunWorkflow,
    singlePlanRunWorkflow,
  },
  agents: { weatherAgent, minecraftAgent, plannerAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
