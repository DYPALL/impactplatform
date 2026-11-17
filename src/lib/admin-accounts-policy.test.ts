import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { requireAdminRole, requireDeletableAccount } from "./admin-accounts-policy";

describe("Admin account permissions", () => {
  it("requires an administrator role for account management", () => {
    assert.throws(() => requireAdminRole([{ role: "user" }]));
    assert.doesNotThrow(() => requireAdminRole([{ role: "admin" }]));
  });
  it("allows deleting any ordinary user account", () => {
    assert.doesNotThrow(() => requireDeletableAccount({ id: "other" }, "admin", false));
  });
  it("never deletes the current account or an administrator", () => {
    assert.throws(() => requireDeletableAccount({ id: "admin" }, "admin", false));
    assert.throws(() => requireDeletableAccount({ id: "other" }, "admin", true));
  });
});
