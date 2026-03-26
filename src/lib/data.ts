import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function getWorkspaceScopedData() {
  const user = await requireSession();
  const workspaceId = user.workspaceId;

  const [stats, activity] = await Promise.all([
    Promise.all([
      prisma.policy.count({ where: { workspaceId, status: "ACTIVE" } }),
      prisma.approval.count({ where: { workspaceId, status: "PENDING" } }),
      prisma.acknowledgement.count({ where: { workspaceId, status: "PENDING", assignedUserId: user.id } }),
      prisma.incident.count({ where: { workspaceId, status: { in: ["OPEN", "UNDER_REVIEW"] } } })
    ]),
    prisma.activityLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { actor: true }
    })
  ]);

  return {
    user,
    workspaceId,
    stats: {
      activePolicies: stats[0],
      pendingApprovals: stats[1],
      pendingAcknowledgements: stats[2],
      openIncidents: stats[3]
    },
    activity
  };
}
