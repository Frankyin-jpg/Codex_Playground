import { NavLink } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { signOut } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-white p-4">
        <h2 className="mb-3 font-semibold">PolicyLedger</h2>
        <p className="mb-4 text-xs text-slate-500">{user.name} ({user.role})</p>
        <nav className="space-y-1">
          {[
            ["/app/dashboard", "Dashboard"],
            ["/app/policies", "Policies"],
            ["/app/approvals", "Approvals"],
            ["/app/acknowledgements", "Acknowledgements"],
            ["/app/incidents", "Incidents"],
            ["/app/reports", "Reports"],
            ["/app/users", "Users"],
            ["/app/settings", "Settings"]
          ].map(([href, label]) => <NavLink href={href} label={label} key={href} />)}
        </nav>
        <form className="mt-6" action={async () => {"use server"; await signOut({ redirectTo: "/" });}}>
          <button className="text-sm text-slate-600 underline">Sign out</button>
        </form>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
