import { Card, PageTitle } from "@/components/ui";
import { requireSession } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await requireSession();
  const workspace = await prisma.workspace.findUnique({ where: { id: user.workspaceId } });
  return <div className="space-y-4"><PageTitle title="Settings" subtitle="Workspace settings" /><Card><p>Name: {workspace?.name}</p><p>Slug: {workspace?.slug}</p></Card></div>;
}
