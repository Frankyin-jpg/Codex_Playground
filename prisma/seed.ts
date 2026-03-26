import { PrismaClient, UserRole, PolicyStatus, ApprovalStatus, AcknowledgementStatus, IncidentStatus, IncidentSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.acknowledgement.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.policyVersion.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: { name: "Acme Compliance", slug: "acme" }
  });

  const [admin, manager, member, viewer] = await Promise.all([
    prisma.user.create({ data: { name: "Admin User", email: "admin@acme.local", role: UserRole.ADMIN, workspaceId: workspace.id } }),
    prisma.user.create({ data: { name: "Manager User", email: "manager@acme.local", role: UserRole.MANAGER, workspaceId: workspace.id } }),
    prisma.user.create({ data: { name: "Member User", email: "member@acme.local", role: UserRole.MEMBER, workspaceId: workspace.id } }),
    prisma.user.create({ data: { name: "Viewer User", email: "viewer@acme.local", role: UserRole.VIEWER, workspaceId: workspace.id } })
  ]);

  const policy = await prisma.policy.create({
    data: { workspaceId: workspace.id, title: "Information Security Policy", category: "Security", ownerUserId: manager.id, status: PolicyStatus.ACTIVE }
  });

  const version = await prisma.policyVersion.create({
    data: {
      policyId: policy.id,
      versionLabel: "v1.0",
      effectiveDate: new Date(),
      reviewDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      contentMarkdown: "# Security Policy\nKeep systems patched.",
      changeSummary: "Initial policy version",
      status: PolicyStatus.ACTIVE,
      createdByUserId: manager.id,
      approvedByUserId: admin.id,
      approvedAt: new Date()
    }
  });

  await prisma.policy.update({ where: { id: policy.id }, data: { currentVersionId: version.id } });

  await prisma.approval.create({
    data: {
      workspaceId: workspace.id,
      title: "Approve policy v1.0",
      requestType: "POLICY_VERSION",
      description: "Ready for final approval",
      relatedEntityType: "PolicyVersion",
      relatedEntityId: version.id,
      requesterUserId: manager.id,
      approverUserId: admin.id,
      status: ApprovalStatus.APPROVED,
      decidedAt: new Date(),
      decisionNotes: "Looks good"
    }
  });

  await prisma.acknowledgement.create({
    data: {
      workspaceId: workspace.id,
      policyVersionId: version.id,
      assignedUserId: member.id,
      status: AcknowledgementStatus.PENDING,
      acknowledgementText: "I have read and understood this policy."
    }
  });

  await prisma.incident.create({
    data: {
      workspaceId: workspace.id,
      title: "Unencrypted laptop lost",
      category: "Asset",
      severity: IncidentSeverity.HIGH,
      description: "Laptop lost during travel.",
      dateDiscovered: new Date(),
      reporterUserId: member.id,
      assigneeUserId: manager.id,
      status: IncidentStatus.UNDER_REVIEW
    }
  });

  await prisma.activityLog.createMany({
    data: [
      { workspaceId: workspace.id, actorUserId: admin.id, action: "SEED_CREATED", entityType: "Workspace", entityId: workspace.id },
      { workspaceId: workspace.id, actorUserId: manager.id, action: "POLICY_CREATED", entityType: "Policy", entityId: policy.id },
      { workspaceId: workspace.id, actorUserId: member.id, action: "INCIDENT_REPORTED", entityType: "Incident", entityId: "seed" }
    ]
  });
}

main().finally(() => prisma.$disconnect());
