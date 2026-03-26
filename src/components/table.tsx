import { Badge, Card } from "@/components/ui";

export function DataTable({ headers, rows }: { headers: string[]; rows: Array<Array<React.ReactNode>> }) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>{headers.map((h) => <th className="px-4 py-3" key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr className="border-t" key={idx}>{row.map((cell, cidx) => <td className="px-4 py-3" key={cidx}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge>{value.replaceAll("_", " ")}</Badge>;
}
