export function requireAdminRole(roles: { role: string }[]) {
  if (!roles.some(row => row.role === "admin")) throw new Error("Administrator access required.");
}

export function requireDeletableAccount(account: { id: string }, callerId: string, isAdmin: boolean) {
  if (account.id === callerId) throw new Error("You cannot delete your own account.");
  if (isAdmin) throw new Error("Administrator accounts cannot be deleted here.");
}
