import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, EmptyState, PageTitle } from "@/components/ui";
import { ActivityFeed } from "@/components/activity-feed";
import { StatusBadge } from "@/components/table";

export default async function PolicyDetailPage({ params }: { params: Promise<{ policyId: string }> }) {
  const user = await requireSession();
  const { policyId } = await params;
  const policy = await prisma.policy.findFirst({
    where: { id: policyId, workspaceId: user.workspaceId },
    include: {
      owner: true,
      currentVersion: true,
      versions: { orderBy: { createdAt: "desc" } }
    }
  });
  if (!policy) notFound();

  const [approvals, acknowledgements, attachments, activity] = await Promise.all([
    prisma.approval.findMany({ where: { workspaceId: user.workspaceId, relatedEntityId: policy.currentVersionId ?? undefined } }),
    prisma.acknowledgement.findMany({ where: { workspaceId: user.workspaceId, policyVersionId: policy.currentVersionId ?? "" }, include: { assignedUser: true } }),
    prisma.attachment.findMany({ where: { workspaceId: user.workspaceId, entityType: "Policy", entityId: policy.id } }),
    prisma.activityLog.findMany({ where: { workspaceId: user.workspaceId, entityType: "Policy", entityId: policy.id }, include: { actor: true }, orderBy: { createdAt: "desc" } })
  ]);

  return <div className="space-y-4"><PageTitle title={policy.title} subtitle="Policy detail" />
    <Card><p>Owner: {policy.owner.name}</p><p>Status: <StatusBadge value={policy.status} /></p></Card>
    <Card><h3 className="font-medium">Current version</h3><p>{policy.currentVersion?.versionLabel ?? "No version"}</p></Card>
    <Card><h3 className="font-medium">Version history</h3><ul className="text-sm">{policy.versions.map((v) => <li key={v.id}>{v.versionLabel} - {v.status}</li>)}</ul></Card>
    <Card><h3 className="font-medium">Linked approvals</h3>{approvals.length ? approvals.map((a) => <p key={a.id}>{a.title} ({a.status})</p>) : <p className="text-sm text-slate-600">No linked approvals.</p>}</Card>
    <Card><h3 className="font-medium">Linked acknowledgements</h3>{acknowledgements.length ? acknowledgements.map((a) => <p key={a.id}>{a.assignedUser.name} ({a.status})</p>) : <p className="text-sm text-slate-600">No acknowledgements.</p>}</Card>
    <Card><h3 className="font-medium">Attachments</h3>{attachments.length ? attachments.map((a) => <p key={a.id}>{a.fileName}</p>) : <p className="text-sm text-slate-600">No attachments.</p>}</Card>
    <div><h3 className="mb-2 font-medium">Activity</h3>{activity.length ? <ActivityFeed items={activity} /> : <EmptyState title="No activity" description="Mutations will appear here." />}</div>
  </div>;
}
