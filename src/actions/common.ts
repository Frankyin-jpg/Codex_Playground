"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireSession } from "@/lib/data";
import { assertCanMutate, hasRole } from "@/lib/permissions";
import { ApprovalStatus, IncidentSeverity, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPolicy(formData: FormData) {
  const user = await requireSession();
  if (!hasRole(user.role, UserRole.MANAGER)) throw new Error("Insufficient permissions");
  const input = z.object({ title: z.string().min(3), category: z.string().min(2) }).parse({ title: formData.get("title"), category: formData.get("category") });
  const policy = await prisma.policy.create({ data: { workspaceId: user.workspaceId, title: input.title, category: input.category, ownerUserId: user.id } });
  await logActivity({ workspaceId: user.workspaceId, actorUserId: user.id, action: "POLICY_CREATED", entityType: "Policy", entityId: policy.id });
  revalidatePath("/app/policies");
}

export async function decideApproval(formData: FormData) {
  const user = await requireSession();
  if (!hasRole(user.role, UserRole.MANAGER)) throw new Error("Insufficient permissions");
  const input = z.object({ id: z.string(), status: z.nativeEnum(ApprovalStatus), decisionNotes: z.string().optional() }).parse({ id: formData.get("id"), status: formData.get("status"), decisionNotes: formData.get("decisionNotes") ?? undefined });
  if (!(["APPROVED", "REJECTED"] as string[]).includes(input.status)) throw new Error("Invalid decision status");
  const existing = await prisma.approval.findFirst({ where: { id: input.id, workspaceId: user.workspaceId } });
  if (!existing) throw new Error("Approval not found");
  const approval = await prisma.approval.update({ where: { id: existing.id }, data: { status: input.status, decisionNotes: input.decisionNotes, decidedAt: new Date() } });
  await logActivity({ workspaceId: user.workspaceId, actorUserId: user.id, action: `APPROVAL_${input.status}`, entityType: "Approval", entityId: approval.id });
  revalidatePath("/app/approvals");
}

export async function acknowledgePolicy(formData: FormData) {
  const user = await requireSession();
  assertCanMutate(user.role);
  const id = z.string().parse(formData.get("id"));
  const existing = await prisma.acknowledgement.findFirst({ where: { id, workspaceId: user.workspaceId, assignedUserId: user.id } });
  if (!existing) throw new Error("Acknowledgement not found");
  const ack = await prisma.acknowledgement.update({ where: { id: existing.id }, data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() } });
  await logActivity({ workspaceId: user.workspaceId, actorUserId: user.id, action: "ACKNOWLEDGEMENT_COMPLETED", entityType: "Acknowledgement", entityId: ack.id });
  revalidatePath("/app/acknowledgements");
}

export async function createIncident(formData: FormData) {
  const user = await requireSession();
  assertCanMutate(user.role);
  const input = z.object({ title: z.string().min(3), category: z.string().min(2), severity: z.nativeEnum(IncidentSeverity), description: z.string().min(10) }).parse({ title: formData.get("title"), category: formData.get("category"), severity: formData.get("severity"), description: formData.get("description") });
  const incident = await prisma.incident.create({ data: { workspaceId: user.workspaceId, title: input.title, category: input.category, severity: input.severity, description: input.description, dateDiscovered: new Date(), reporterUserId: user.id } });
  await logActivity({ workspaceId: user.workspaceId, actorUserId: user.id, action: "INCIDENT_CREATED", entityType: "Incident", entityId: incident.id });
  revalidatePath("/app/incidents");
}
