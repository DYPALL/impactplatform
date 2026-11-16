export function requireAdminRole(roles: { role: string }[]) {
  if (!roles.some(row => row.role === "admin")) throw new Error("Administrator access required.");
}

export function requireDeletableTestAccount(account: { id: string; app_metadata?: Record<string, unknown> }, callerId: string, isAdmin: boolean) {
  if (account.id === callerId || isAdmin || account.app_metadata?.impact_test_account !== true) {
    throw new Error("Only marked test accounts without administrator access can be deleted.");
  }
}