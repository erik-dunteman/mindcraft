import { createWorkflow, createStep } from "@mastra/core/workflows";
import { mastraClient } from "../lib/client";
import { z } from "zod";

const maxLoops = 10;
const state = z.object({
  task: z.string(),
  loops: z.number().optional().default(0),
  done: z.boolean().optional().default(false),
});

const planner = createStep({
  id: "planner",
  description: "runs planner subagent",
  inputSchema: state,
  outputSchema: state,
  execute: async ({ inputData }) => {
    console.log("running planner");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return inputData;
  },
});

const runner = createStep({
  id: "runner",
  description: "runs runner subagent",
  inputSchema: state,
  outputSchema: state,
  execute: async ({ inputData }) => {
    console.log("running runner");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    inputData.loops++;
    return inputData;
  },
});

const start = createStep({
  id: "start",
  description: "starts the workflow",
  inputSchema: state,
  outputSchema: state,
  execute: async ({ inputData }) => {
    return inputData;
  },
});

const end = createStep({
  id: "end",
  description: "ends the workflow",
  inputSchema: state,
  outputSchema: state,
  execute: async ({ inputData }) => {
    return inputData;
  },
});

export const singlePlanRunWorkflow = createWorkflow({
  id: "single-plan-run-workflow",
  inputSchema: state,
  outputSchema: state,
})
  .then(planner)
  .then(runner)
  .commit();

export const planRunWorkflow = createWorkflow({
  id: "planner-runner-loop-workflow",
  inputSchema: state,
  outputSchema: state,
})
  .then(start) // not really necessary, but makes graph nicer
  .dountil(singlePlanRunWorkflow, async ({ inputData }) => {
    console.log("inputData", inputData);
    return inputData.done || inputData.loops > maxLoops;
  })
  .then(end) // not really necessary, but makes graph nicer
  .commit();
