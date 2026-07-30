import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Module-level cache so remounting components (e.g. the header on route
// changes) don't flash back to the logged-out state while the session loads.
let cachedUser: User | null = null;
let cachedLoading = true;
const listeners = new Set<(u: User | null) => void>();
let started = false;

function setCached(u: User | null) {
  cachedUser = u;
  cachedLoading = false;
  listeners.forEach((l) => l(u));
}

function start() {
  if (started) return;
  started = true;
  supabase.auth.onAuthStateChange((_event, session) => setCached(session?.user ?? null));
  supabase.auth.getSession().then(({ data }) => setCached(data.session?.user ?? null));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(cachedLoading);

  useEffect(() => {
    start();
    const listener = (u: User | null) => {
      setUser(u);
      setLoading(false);
    };
    listeners.add(listener);
    if (!cachedLoading) listener(cachedUser);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { user, loading, signOut: () => supabase.auth.signOut() };
}
