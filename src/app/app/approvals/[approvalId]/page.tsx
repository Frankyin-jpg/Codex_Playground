import { decideApproval } from "@/actions/common";
import { ActivityFeed } from "@/components/activity-feed";
import { Card, PageTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/data";
import { hasRole } from "@/lib/permissions";
import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function ApprovalDetailPage({ params }: { params: Promise<{ approvalId: string }> }) {
  const user = await requireSession();
  const { approvalId } = await params;
  const approval = await prisma.approval.findFirst({ where: { id: approvalId, workspaceId: user.workspaceId }, include: { requester: true, approver: true } });
  if (!approval) notFound();
  const activity = await prisma.activityLog.findMany({ where: { workspaceId: user.workspaceId, entityType: "Approval", entityId: approval.id }, include: { actor: true }, orderBy: { createdAt: "desc" } });
  return <div className="space-y-4"><PageTitle title={approval.title} subtitle="Approval detail" />
    <Card><p>Type: {approval.requestType}</p><p>Status: {approval.status}</p><p>Requester: {approval.requester.name}</p><p>Approver: {approval.approver.name}</p></Card>
    {hasRole(user.role, UserRole.MANAGER) && approval.status === "PENDING" ? <Card><h3 className="mb-2 font-medium">Decision controls</h3><form action={decideApproval} className="space-y-2"><input type="hidden" name="id" value={approval.id} /><textarea name="decisionNotes" className="w-full rounded border p-2" placeholder="Decision notes" /><div className="flex gap-2"><button name="status" value="APPROVED" className="rounded bg-green-700 px-3 py-2 text-white">Approve</button><button name="status" value="REJECTED" className="rounded bg-red-700 px-3 py-2 text-white">Reject</button></div></form></Card> : null}
    <ActivityFeed items={activity} />
  </div>;
}
