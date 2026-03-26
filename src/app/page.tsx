import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">PolicyLedger</h1>
      <p className="mt-2 text-slate-600">Simple, audit-ready policy and incident records for small teams.</p>
      <div className="mt-6 flex gap-3">
        <Link className="rounded bg-slate-900 px-4 py-2 text-white" href="/login">Login</Link>
        <Link className="rounded border px-4 py-2" href="/pricing">Pricing</Link>
      </div>
    </main>
  );
}
