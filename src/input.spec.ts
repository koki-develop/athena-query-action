import { describe, expect, test } from "vitest";
import { parseInputs } from "./input";

describe("parseInputs", () => {
  test.each([
    {
      input: {
        query: "QUERY",
        outputLocation: "OUTPUT_LOCATION",
        workgroup: "WORKGROUP",
        database: "DATABASE",
        catalog: "CATALOG",
        parameters: "PARAM1,PARAM2",
      },
      expected: {
        query: "QUERY",
        outputLocation: "OUTPUT_LOCATION",
        workgroup: "WORKGROUP",
        database: "DATABASE",
        catalog: "CATALOG",
        parameters: ["PARAM1", "PARAM2"],
      },
    },
    {
      input: {
        query: "QUERY",
        outputLocation: "",
        workgroup: "",
        database: "",
        catalog: "",
        parameters: "",
      },
      expected: {
        query: "QUERY",
        parameters: [],
      },
    },
    {
      input: {
        query: "QUERY",
        outputLocation: "",
        workgroup: "",
        database: "",
        catalog: "",
        parameters: "PARAM1,PARAM2\nPARAM3,PARAM4",
      },
      expected: {
        query: "QUERY",
        parameters: ["PARAM1", "PARAM2\nPARAM3", "PARAM4"],
      },
    },
  ])("parseInputs(%j) returns %j", ({ input, expected }) => {
    expect(parseInputs(input)).toEqual(expected);
  });
});
