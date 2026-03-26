import { prisma } from "@/lib/prisma";

export async function logActivity(params: {
  workspaceId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadataJson?: unknown;
}) {
  await prisma.activityLog.create({
    data: {
      workspaceId: params.workspaceId,
      actorUserId: params.actorUserId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadataJson: params.metadataJson as object | undefined
    }
  });
}
