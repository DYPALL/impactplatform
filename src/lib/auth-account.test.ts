import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { isSocialAccount } from "./auth-account";

describe("Google and Apple sign-in success screen", () => {
  it("shows the success screen for Google and Apple accounts", () => {
    assert.equal(isSocialAccount({ app_metadata: { provider: "google" } }), true);
    assert.equal(isSocialAccount({ app_metadata: { provider: "Apple" } }), true);
  });
  it("does not show it for email accounts or before a session exists", () => {
    assert.equal(isSocialAccount({ app_metadata: { provider: "email" } }), false);
    assert.equal(isSocialAccount({ app_metadata: {} }), false);
    assert.equal(isSocialAccount(null), false);
  });
});
