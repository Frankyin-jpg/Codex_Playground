import { ActivityFeed } from "@/components/activity-feed";
import { Card, PageTitle } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function IncidentDetailPage({ params }: { params: Promise<{ incidentId: string }> }) {
  const user = await requireSession();
  const { incidentId } = await params;
  const incident = await prisma.incident.findFirst({ where: { id: incidentId, workspaceId: user.workspaceId }, include: { reporter: true, assignee: true } });
  if (!incident) notFound();
  const [attachments, activity] = await Promise.all([
    prisma.attachment.findMany({ where: { workspaceId: user.workspaceId, entityType: "Incident", entityId: incident.id } }),
    prisma.activityLog.findMany({ where: { workspaceId: user.workspaceId, entityType: "Incident", entityId: incident.id }, include: { actor: true }, orderBy: { createdAt: "desc" } })
  ]);
  return <div className="space-y-4"><PageTitle title={incident.title} subtitle="Incident detail" />
    <Card><p>Severity: {incident.severity}</p><p>Status: {incident.status}</p><p>Reporter: {incident.reporter.name}</p><p>Assignee: {incident.assignee?.name ?? "Unassigned"}</p><p>{incident.description}</p></Card>
    <Card><h3 className="font-medium">Corrective action</h3><p>{incident.correctiveAction ?? "No corrective action recorded."}</p></Card>
    <Card><h3 className="font-medium">Attachments</h3>{attachments.length ? attachments.map((a) => <p key={a.id}>{a.fileName}</p>) : <p className="text-sm text-slate-600">No attachments.</p>}</Card>
    <ActivityFeed items={activity} />
  </div>;
}
