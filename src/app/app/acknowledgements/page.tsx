import { acknowledgePolicy } from "@/actions/common";
import { DataTable, StatusBadge } from "@/components/table";
import { EmptyState, PageTitle } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export default async function AcknowledgementsPage() {
  const user = await requireSession();
  const where = hasRole(user.role, UserRole.MANAGER) ? { workspaceId: user.workspaceId } : { workspaceId: user.workspaceId, assignedUserId: user.id };
  const acknowledgements = await prisma.acknowledgement.findMany({ where, include: { assignedUser: true, policyVersion: { include: { policy: true } } }, orderBy: { createdAt: "desc" } });

  return <div className="space-y-4"><PageTitle title="Acknowledgements" subtitle={hasRole(user.role, UserRole.MANAGER) ? "Workspace acknowledgements" : "My acknowledgements"} />
  {!acknowledgements.length ? <EmptyState title="No acknowledgements" description="Assignments will appear here." /> : <DataTable headers={["Policy", "Assigned User", "Status", "Acknowledged At", "Action"]} rows={acknowledgements.map((a) => [a.policyVersion.policy.title, a.assignedUser.name, <StatusBadge key={`${a.id}-s`} value={a.status} />, a.acknowledgedAt?.toLocaleString() ?? "—", a.status === "PENDING" && a.assignedUserId === user.id ? <form action={acknowledgePolicy} key={a.id}><input type="hidden" name="id" value={a.id} /><button className="rounded border px-2 py-1">Acknowledge</button></form> : "—"])}/>} 
  </div>;
}
