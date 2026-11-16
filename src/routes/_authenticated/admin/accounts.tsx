import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Users, Search, UserPlus, Mail, Trash2, RefreshCw, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { listAdminAccounts, createTestAccount, resetAccountPassword, deleteTestAccount } from "@/lib/admin-accounts.functions";

const accountQuery = queryOptions({ queryKey: ["admin-accounts"], queryFn: () => listAdminAccounts() });

export const Route = createFileRoute("/_authenticated/admin/accounts")({
  loader: ({ context }) => context.queryClient.ensureQueryData(accountQuery),
  head: () => ({ meta: [
    { title: "User Accounts — IMPACT Admin" },
    { name: "description", content: "Manage IMPACT user accounts, password recovery and test accounts." },
    { property: "og:title", content: "User Accounts — IMPACT Admin" },
    { property: "og:description", content: "Manage IMPACT user accounts, password recovery and test accounts." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  pendingComponent: () => <p className="text-muted-foreground">Loading accounts…</p>,
  errorComponent: ({ error, reset }) => <div className="space-y-4"><h1 className="text-2xl font-bold text-primary">User accounts</h1><p role="alert" className="text-destructive">{error instanceof Error ? error.message : "Could not load accounts."}</p><Button onClick={reset}><RefreshCw /> Try again</Button></div>,
  component: AccountsPage,
});

type Account = Awaited<ReturnType<typeof listAdminAccounts>>[number];

function AccountsPage() {
  const { data: accounts } = useSuspenseQuery(accountQuery);
  const queryClient = useQueryClient();
  const createAccount = useServerFn(createTestAccount);
  const sendReset = useServerFn(resetAccountPassword);
  const removeAccount = useServerFn(deleteTestAccount);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [kind, setKind] = useState("all");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [action, setAction] = useState<{ type: "reset" | "delete"; account: Account } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const countries = useMemo(() => [...new Set(accounts.map(a => a.country).filter(Boolean))].sort(), [accounts]);
  const filtered = accounts.filter(a => (!country || a.country === country) && (kind === "all" || a.test === (kind === "test")) && `${a.name} ${a.email} ${a.council}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totalPages = Math.max(1, Math.ceil(filtered.length / 25));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * 25, currentPage * 25);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true); setError(""); setNotice("");
    try {
      await createAccount({ data: { name: String(form.get("name")), email: String(form.get("email")), country: String(form.get("country")), password: String(form.get("password")) } });
      setCreating(false);
      setNotice("Test account created. Email verification is still required; send a password reset email to let its owner set up access.");
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create the account."); }
    finally { setBusy(false); }
  }

  async function confirmAction() {
    if (!action) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (action.type === "reset") await sendReset({ data: { id: action.account.id } });
      else await removeAccount({ data: { id: action.account.id } });
      setNotice(action.type === "reset" ? "Password reset email sent." : "Test account deleted.");
      setAction(null);
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not complete the action."); }
    finally { setBusy(false); }
  }

  const selectClass = "h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground";
  return <div className="min-w-0 text-foreground">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div><div className="flex items-center gap-3"><Users className="text-primary" /><h1 className="text-3xl font-extrabold text-primary">User accounts</h1></div><p className="mt-2 text-sm text-muted-foreground">{accounts.length} accounts · {accounts.filter(a => a.test).length} test accounts</p></div>
      <div className="flex gap-2"><Button variant="outline" size="icon" title="Refresh accounts" aria-label="Refresh accounts" onClick={() => void refresh()}><RefreshCw /></Button><Button className="rounded-full" onClick={() => { setError(""); setCreating(true); }}><UserPlus /> Create test account</Button></div>
    </div>
    {notice && <p role="status" className="mb-5 rounded-md border border-border bg-accent p-4 text-sm">{notice}</p>}
    {error && !creating && !action && <p role="alert" className="mb-5 text-sm text-destructive">{error}</p>}
    <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(200px,1fr)_220px_180px]">
      <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search accounts" placeholder="Search name, email or council" className="h-10 pl-10" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
      <select aria-label="Filter by country" className={selectClass} value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}><option value="">All countries</option>{countries.map(c => <option key={c}>{c}</option>)}</select>
      <select aria-label="Account type" className={selectClass} value={kind} onChange={e => { setKind(e.target.value); setPage(1); }}><option value="all">All accounts</option><option value="real">User accounts</option><option value="test">Test accounts</option></select>
    </div>
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted/60 text-xs text-muted-foreground"><tr>{["Account", "Country / Council", "Created", "Status", "Actions"].map(label => <th key={label} className="px-5 py-4 font-bold">{label}</th>)}</tr></thead>
        <tbody>{rows.map(account => <tr key={account.id} className="border-b border-border last:border-0">
          <td className="px-5 py-4"><p className="font-semibold">{account.name || "Name not provided"}</p><p className="mt-1 break-all text-xs text-muted-foreground">{account.email || "Email not provided"}</p>{account.test && <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"><FlaskConical size={13} /> Test account</span>}</td>
          <td className="px-5 py-4"><p>{account.country || "Not provided"}</p><p className="mt-1 text-xs text-muted-foreground">{account.council}</p></td>
          <td className="whitespace-nowrap px-5 py-4 text-xs">{new Date(account.createdAt).toLocaleDateString("en-GB")}<p className="mt-1 text-muted-foreground">{account.lastSignIn ? `Last log-in ${new Date(account.lastSignIn).toLocaleDateString("en-GB")}` : "Not logged in yet"}</p></td>
          <td className="px-5 py-4 text-xs">{account.confirmed ? "Verified" : "Awaiting verification"}</td>
          <td className="px-5 py-4"><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label={`Reset password for ${account.email}`} title="Send password reset email" disabled={!account.email} onClick={() => { setError(""); setAction({ type: "reset", account }); }}><Mail /></Button>{account.test && <Button variant="ghost" size="icon" className="text-destructive" aria-label={`Delete test account ${account.email}`} title="Delete test account" onClick={() => { setError(""); setAction({ type: "delete", account }); }}><Trash2 /></Button>}</div></td>
        </tr>)}</tbody>
      </table>{!rows.length && <p className="p-10 text-center text-muted-foreground">No accounts match these filters.</p>}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"><p>{filtered.length} matching accounts</p><div className="flex items-center gap-3"><Button variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button><span>{currentPage} / {totalPages}</span><Button variant="outline" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</Button></div></div>
    <Dialog open={creating} onOpenChange={value => { if (!busy) setCreating(value); }}><DialogContent><DialogHeader><DialogTitle>Create test account</DialogTitle><DialogDescription>This account will be marked for testing. Email verification remains required.</DialogDescription></DialogHeader><form onSubmit={handleCreate} className="space-y-4">
      <label className="block text-sm font-semibold">Name<Input name="name" required maxLength={100} className="mt-1" /></label><label className="block text-sm font-semibold">Email<Input name="email" type="email" autoComplete="off" required maxLength={255} className="mt-1" /></label><label className="block text-sm font-semibold">Country<Input name="country" required maxLength={80} className="mt-1" list="account-countries" /></label><datalist id="account-countries">{countries.map(c => <option key={c} value={c} />)}</datalist><label className="block text-sm font-semibold">Temporary password<Input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className="mt-1" /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<DialogFooter><Button type="button" variant="outline" disabled={busy} onClick={() => setCreating(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create test account"}</Button></DialogFooter>
    </form></DialogContent></Dialog>
    <Dialog open={Boolean(action)} onOpenChange={value => { if (!value && !busy) setAction(null); }}><DialogContent><DialogHeader><DialogTitle>{action?.type === "delete" ? "Delete test account?" : "Send password reset email?"}</DialogTitle><DialogDescription>{action?.type === "delete" ? "This permanently deletes the marked test account and its associated data. Real user accounts cannot be deleted here." : "The account owner will receive a secure link to choose a new password."}</DialogDescription></DialogHeader><p className="break-all text-sm font-semibold">{action?.account.email}</p>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<DialogFooter><Button variant="outline" disabled={busy} onClick={() => setAction(null)}>Cancel</Button><Button variant={action?.type === "delete" ? "destructive" : "default"} disabled={busy} onClick={() => void confirmAction()}>{busy ? "Please wait…" : action?.type === "delete" ? "Delete test account" : "Send reset email"}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}