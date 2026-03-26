import Link from "next/link";
import { PolicyStatus, UserRole } from "@prisma/client";
import { DataTable, StatusBadge } from "@/components/table";
import { EmptyState, PageTitle } from "@/components/ui";
import { createPolicy } from "@/actions/common";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/data";
import { hasRole } from "@/lib/permissions";

export default async function PoliciesPage({ searchParams }: { searchParams: Promise<{ status?: string; category?: string }> }) {
  const user = await requireSession();
  const query = await searchParams;
  const status = query.status && Object.values(PolicyStatus).includes(query.status as PolicyStatus) ? (query.status as PolicyStatus) : undefined;
  const policies = await prisma.policy.findMany({
    where: { workspaceId: user.workspaceId, status, category: query.category || undefined },
    include: { owner: true, currentVersion: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <PageTitle title="Policies" />
      <form className="flex gap-2">
        <input name="category" placeholder="Filter by category" className="rounded border p-2" />
        <select name="status" className="rounded border p-2"><option value="">All statuses</option><option>DRAFT</option><option>ACTIVE</option><option>ARCHIVED</option></select>
        <button className="rounded border px-3">Apply filters</button>
      </form>
      {hasRole(user.role, UserRole.MANAGER) ? (
        <form action={createPolicy} className="flex gap-2">
          <input name="title" placeholder="Policy title" className="rounded border p-2" required />
          <input name="category" placeholder="Category" className="rounded border p-2" required />
          <button className="rounded bg-slate-900 px-3 py-2 text-white">Create policy</button>
        </form>
      ) : null}
      {!policies.length ? <EmptyState title="No policies" description="Create your first policy to begin." /> : (
        <DataTable
          headers={["Title", "Category", "Current Version", "Status", "Owner", "Effective", "Review Due"]}
          rows={policies.map((p) => [
            <Link className="underline" href={`/app/policies/${p.id}`} key={p.id}>{p.title}</Link>,
            p.category,
            p.currentVersion?.versionLabel ?? "—",
            <StatusBadge key={`${p.id}-s`} value={p.status} />,
            p.owner.name,
            p.currentVersion?.effectiveDate?.toLocaleDateString() ?? "—",
            p.currentVersion?.reviewDueDate?.toLocaleDateString() ?? "—"
          ])}
        />
      )}
    </div>
  );
}
