import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { requireAdminRole, requireDeletableTestAccount } from "./admin-accounts-policy";

describe("Admin account permissions", () => {
  it("requires an administrator role for account management", () => {
    assert.throws(() => requireAdminRole([{ role: "user" }]));
    assert.doesNotThrow(() => requireAdminRole([{ role: "admin" }]));
  });
  it("allows deletion of marked test accounts only", () => {
    assert.throws(() => requireDeletableTestAccount({ id: "other", app_metadata: {} }, "admin", false));
    assert.doesNotThrow(() => requireDeletableTestAccount({ id: "other", app_metadata: { impact_test_account: true } }, "admin", false));
  });
  it("never deletes the current account or an administrator", () => {
    const account = { id: "admin", app_metadata: { impact_test_account: true } };
    assert.throws(() => requireDeletableTestAccount(account, "admin", false));
    assert.throws(() => requireDeletableTestAccount(account, "other", true));
  });
});