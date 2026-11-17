import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { isConfirmationRateLimit, isUnconfirmedEmailError } from "./auth-errors";

describe("Email confirmation sign-in failures", () => {
  it("recognises an unconfirmed email so the visitor sees the confirmation screen", () => {
    assert.equal(isUnconfirmedEmailError("Email not confirmed"), true);
    assert.equal(isUnconfirmedEmailError("email_not_confirmed"), true);
    assert.equal(isUnconfirmedEmailError("Email address not verified"), true);
  });
  it("does not treat other sign-in failures as an unconfirmed email", () => {
    assert.equal(isUnconfirmedEmailError("Invalid login credentials"), false);
    assert.equal(isUnconfirmedEmailError(undefined), false);
  });
  it("reads the one-minute confirmation-email cooldown as a wait, not a failure", () => {
    assert.equal(isConfirmationRateLimit("For security purposes, you can only request this after 57 seconds.", 429), true);
    assert.equal(isConfirmationRateLimit("For security purposes, you can only request this after 57 seconds."), true);
    assert.equal(isConfirmationRateLimit("Email rate limit exceeded", 500), false);
  });
});
