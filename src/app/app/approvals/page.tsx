import Link from "next/link";
import { ApprovalStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/data";
import { DataTable, StatusBadge } from "@/components/table";
import { EmptyState, PageTitle } from "@/components/ui";

export default async function ApprovalsPage({ searchParams }: { searchParams: Promise<{ status?: string; type?: string }> }) {
  const user = await requireSession();
  const query = await searchParams;
  const status = query.status && Object.values(ApprovalStatus).includes(query.status as ApprovalStatus) ? (query.status as ApprovalStatus) : undefined;
  const approvals = await prisma.approval.findMany({
    where: { workspaceId: user.workspaceId, status, requestType: query.type || undefined },
    include: { requester: true, approver: true },
    orderBy: { submittedAt: "desc" }
  });

  return <div className="space-y-4"><PageTitle title="Approvals" />
    <form className="flex gap-2"><select name="status" className="rounded border p-2"><option value="">All</option><option>PENDING</option><option>APPROVED</option><option>REJECTED</option></select><input name="type" placeholder="Type" className="rounded border p-2"/><button className="rounded border px-3">Apply filters</button></form>
    {!approvals.length ? <EmptyState title="No approvals" description="Approvals will appear here." /> : <DataTable headers={["Title","Type","Requester","Approver","Status","Submitted"]} rows={approvals.map((a)=>[
      <Link href={`/app/approvals/${a.id}`} className="underline" key={a.id}>{a.title}</Link>, a.requestType, a.requester.name, a.approver.name, <StatusBadge key={`${a.id}s`} value={a.status} />, a.submittedAt.toLocaleDateString()
    ])} />}
  </div>;
}
