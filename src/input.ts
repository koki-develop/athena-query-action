import { parse } from "csv-parse/sync";

export type ParsedInputs = {
  query: string;
  outputLocation?: string;
  workgroup?: string;
  database?: string;
  catalog?: string;
  parameters: string[];
};

export type Inputs = {
  query: string;
  outputLocation: string;
  workgroup: string;
  database: string;
  catalog: string;
  parameters: string;
};

export const parseInputs = (inputs: Inputs): ParsedInputs => {
  const parameters = (() => {
    if (inputs.parameters.trim() === "") {
      return [];
    }
    return (
      parse(inputs.parameters.trim().replaceAll("\n", "\\n")) as string[][]
    )[0].map((s) => s.replaceAll("\\n", "\n"));
  })();

  return {
    query: inputs.query,
    outputLocation: inputs.outputLocation || undefined,
    workgroup: inputs.workgroup || undefined,
    database: inputs.database || undefined,
    catalog: inputs.catalog || undefined,
    parameters,
  };
};
