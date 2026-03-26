import { DataTable, StatusBadge } from "@/components/table";
import { EmptyState, PageTitle } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { canManageUsers } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const user = await requireSession();
  const users = await prisma.user.findMany({ where: { workspaceId: user.workspaceId }, orderBy: { createdAt: "asc" } });
  return <div className="space-y-4"><PageTitle title="Users" subtitle="Workspace user list and roles." />
  {!users.length ? <EmptyState title="No users" description="Add a user to get started." /> : <DataTable headers={["Name","Email","Role"]} rows={users.map((u) => [u.name, u.email, <StatusBadge key={u.id} value={u.role} />])} />}
  {canManageUsers(user.role) ? <p className="text-sm text-slate-600">Invite flow placeholder: add users through Prisma studio for MVP.</p> : null}
  </div>;
}
