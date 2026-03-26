import { Card } from "@/components/ui";

export function ActivityFeed({ items }: { items: { id: string; action: string; entityType: string; createdAt: Date; actor: { name: string } }[] }) {
  if (!items.length) return <Card>No activity yet.</Card>;
  return (
    <Card>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className="border-b pb-2 last:border-b-0">
            <span className="font-medium">{item.actor.name}</span> {item.action} {item.entityType}
            <span className="block text-xs text-slate-500">{item.createdAt.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
