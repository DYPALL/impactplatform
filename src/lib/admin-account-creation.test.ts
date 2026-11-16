import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { userAccountAttributes } from "./admin-account-creation";

describe("Administrator-created user accounts", () => {
  const account = userAccountAttributes({ email: "member@example.com", password: "fixture-only-value", name: "Member", country: "Italy" });
  it("creates an ordinary user without a test marker or privileged role", () => {
    assert.equal(Object.hasOwn(account, "app_metadata"), false);
    assert.deepEqual(account.user_metadata, { full_name: "Member", country: "Italy" });
  });
  it("keeps email verification required", () => {
    assert.equal(account.email_confirm, false);
  });
});