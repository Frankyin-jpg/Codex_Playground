import { ActivityFeed } from "@/components/activity-feed";
import { Card, PageTitle } from "@/components/ui";
import { getWorkspaceScopedData } from "@/lib/data";

export default async function DashboardPage() {
  const { stats, activity } = await getWorkspaceScopedData();
  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" subtitle="Compliance and policy operations at a glance." />
      <div className="grid gap-3 md:grid-cols-4">
        <Card><p className="text-xs text-slate-600">Active policies</p><p className="text-2xl font-semibold">{stats.activePolicies}</p></Card>
        <Card><p className="text-xs text-slate-600">Pending approvals</p><p className="text-2xl font-semibold">{stats.pendingApprovals}</p></Card>
        <Card><p className="text-xs text-slate-600">Pending acknowledgements</p><p className="text-2xl font-semibold">{stats.pendingAcknowledgements}</p></Card>
        <Card><p className="text-xs text-slate-600">Open incidents</p><p className="text-2xl font-semibold">{stats.openIncidents}</p></Card>
      </div>
      <Card>
        <h2 className="mb-2 font-medium">Compliance health</h2>
        <p className="text-sm text-slate-600">Simple health score is based on pending approvals and unresolved incidents.</p>
      </Card>
      <div>
        <h2 className="mb-2 font-medium">Recent activity</h2>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
