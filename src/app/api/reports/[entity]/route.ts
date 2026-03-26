import { NextRequest } from "next/server";
import { requireSession } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { AcknowledgementStatus, ApprovalStatus, IncidentStatus, PolicyStatus } from "@prisma/client";

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
  return [headers.join(","), ...lines].join("\n");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const user = await requireSession();
  const { entity } = await params;
  const statusRaw = req.nextUrl.searchParams.get("status") || undefined;

  const rows = entity === "policies"
    ? await prisma.policy.findMany({ where: { workspaceId: user.workspaceId, status: statusRaw && Object.values(PolicyStatus).includes(statusRaw as PolicyStatus) ? (statusRaw as PolicyStatus) : undefined } })
    : entity === "approvals"
    ? await prisma.approval.findMany({ where: { workspaceId: user.workspaceId, status: statusRaw && Object.values(ApprovalStatus).includes(statusRaw as ApprovalStatus) ? (statusRaw as ApprovalStatus) : undefined } })
    : entity === "acknowledgements"
    ? await prisma.acknowledgement.findMany({ where: { workspaceId: user.workspaceId, status: statusRaw && Object.values(AcknowledgementStatus).includes(statusRaw as AcknowledgementStatus) ? (statusRaw as AcknowledgementStatus) : undefined } })
    : await prisma.incident.findMany({ where: { workspaceId: user.workspaceId, status: statusRaw && Object.values(IncidentStatus).includes(statusRaw as IncidentStatus) ? (statusRaw as IncidentStatus) : undefined } });

  return new Response(toCsv(rows as unknown as Record<string, unknown>[]), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${entity}.csv`
    }
  });
}
