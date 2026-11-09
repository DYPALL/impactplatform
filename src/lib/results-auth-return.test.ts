import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { resultsReturnArea, matchesResultsReturn } from "./results-auth-return";

describe("return to the completed assessment after authentication", () => {
  it("accepts assessment areas, not external redirect addresses", () => {
    assert.equal(resultsReturnArea("representativeness"), "representativeness");
    assert.equal(resultsReturnArea("https://example.com"), undefined);
  });
  it("returns only to completed results from the area selected before login or signup", () => {
    assert.equal(matchesResultsReturn("governance", { area: "governance", completed: true }), true);
    assert.equal(matchesResultsReturn("governance", { area: "results", completed: true }), false);
    assert.equal(matchesResultsReturn("governance", { area: "governance", completed: false }), false);
    assert.equal(matchesResultsReturn(undefined, { area: "governance", completed: true }), false);
  });
});