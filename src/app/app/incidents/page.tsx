import Link from "next/link";
import { IncidentSeverity, IncidentStatus, UserRole } from "@prisma/client";
import { createIncident } from "@/actions/common";
import { DataTable, StatusBadge } from "@/components/table";
import { EmptyState, PageTitle } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/permissions";

export default async function IncidentsPage({ searchParams }: { searchParams: Promise<{ severity?: string; status?: string }> }) {
  const user = await requireSession();
  const query = await searchParams;
  const severity = query.severity && Object.values(IncidentSeverity).includes(query.severity as IncidentSeverity) ? (query.severity as IncidentSeverity) : undefined;
  const status = query.status && Object.values(IncidentStatus).includes(query.status as IncidentStatus) ? (query.status as IncidentStatus) : undefined;
  const incidents = await prisma.incident.findMany({ where: { workspaceId: user.workspaceId, severity, status }, include: { assignee: true }, orderBy: { dateDiscovered: "desc" } });

  return <div className="space-y-4"><PageTitle title="Incidents" />
    <form className="flex gap-2"><select name="severity" className="rounded border p-2"><option value="">All severities</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select><select name="status" className="rounded border p-2"><option value="">All status</option><option>OPEN</option><option>UNDER_REVIEW</option><option>RESOLVED</option><option>CLOSED</option></select><button className="rounded border px-3">Apply filters</button></form>
    {hasRole(user.role, UserRole.MEMBER) ? <form action={createIncident} className="grid grid-cols-2 gap-2"><input name="title" placeholder="Title" className="rounded border p-2" required/><input name="category" placeholder="Category" className="rounded border p-2" required/><select name="severity" className="rounded border p-2"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select><input name="description" placeholder="Description" className="col-span-2 rounded border p-2" required/><button className="col-span-2 rounded bg-slate-900 px-3 py-2 text-white">Submit incident</button></form> : null}
    {!incidents.length ? <EmptyState title="No incidents" description="No incidents match the current filters." /> : <DataTable headers={["Title","Severity","Status","Assignee","Date Discovered"]} rows={incidents.map((i) => [<Link href={`/app/incidents/${i.id}`} className="underline" key={i.id}>{i.title}</Link>, <StatusBadge key={`${i.id}sev`} value={i.severity} />, <StatusBadge key={`${i.id}st`} value={i.status} />, i.assignee?.name ?? "—", i.dateDiscovered.toLocaleDateString()])} />}
  </div>;
}
