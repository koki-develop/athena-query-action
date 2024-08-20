import * as core from "@actions/core";
import {
  AthenaClient,
  GetQueryExecutionCommand,
  QueryExecutionState,
  StartQueryExecutionCommand,
  type StartQueryExecutionCommandInput,
} from "@aws-sdk/client-athena";

export const main = async () => {
  try {
    const inputs = {
      query: core.getInput("query"),
      outputLocation: core.getInput("output-location"),
      workgroup: core.getInput("workgroup"),
      database: core.getInput("database"),
      catalog: core.getInput("catalog"),
      parameters: core.getInput("parameters").trim().split("\n"),
    } as const;

    const client = new AthenaClient();

    const input: StartQueryExecutionCommandInput = {
      QueryString: inputs.query,
    };
    if (inputs.outputLocation !== "") {
      input.ResultConfiguration = { OutputLocation: inputs.outputLocation };
    }
    if (inputs.workgroup !== "") {
      input.WorkGroup = inputs.workgroup;
    }
    if (inputs.database !== "" || inputs.catalog !== "") {
      input.QueryExecutionContext = {
        Database: inputs.database || undefined,
        Catalog: inputs.catalog || undefined,
      };
    }
    if (inputs.parameters.length > 0) {
      input.ExecutionParameters = inputs.parameters;
    }

    const startResponse = await client.send(
      new StartQueryExecutionCommand(input),
    );
    core.info(
      `Query execution started with ID: ${startResponse.QueryExecutionId}`,
    );
    core.setOutput("execution-id", startResponse.QueryExecutionId);

    core.info("Waiting for query execution to complete...");
    let state: QueryExecutionState;
    do {
      const statusResponse = await client.send(
        new GetQueryExecutionCommand({
          QueryExecutionId: startResponse.QueryExecutionId,
        }),
      );
      // biome-ignore lint/style/noNonNullAssertion:
      const execution = statusResponse.QueryExecution!;
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const status = execution.Status!;
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      state = status.State!;

      switch (state) {
        case QueryExecutionState.SUCCEEDED:
          core.info("Query execution completed successfully");
          core.setOutput(
            "output-location",
            // biome-ignore lint/style/noNonNullAssertion:
            execution.ResultConfiguration!.OutputLocation!,
          );
          break;
        case QueryExecutionState.FAILED:
          throw new Error(status.StateChangeReason);
        case QueryExecutionState.CANCELLED:
          throw new Error(status.StateChangeReason);
        case QueryExecutionState.RUNNING:
        case QueryExecutionState.QUEUED:
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;
      }
    } while (
      state === QueryExecutionState.RUNNING ||
      state === QueryExecutionState.QUEUED
    );
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      throw error;
    }
  }
};

await main();
