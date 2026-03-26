import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";

const entities = ["policies", "approvals", "acknowledgements", "incidents"];

export default function ReportsPage() {
  return <div className="space-y-4"><PageTitle title="Reports" subtitle="Export audit-ready CSV records." />
    <div className="grid gap-3 md:grid-cols-2">{entities.map((entity) => <Card key={entity}><h3 className="font-medium capitalize">{entity}</h3><p className="mb-3 text-sm text-slate-600">Download workspace-scoped CSV.</p><Link className="rounded border px-3 py-2 text-sm" href={`/api/reports/${entity}`}>Export CSV</Link></Card>)}</div>
  </div>;
}
