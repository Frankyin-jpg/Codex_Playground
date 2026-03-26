import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border bg-white p-4", className)} {...props} />;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">{children}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <Card><h3 className="font-semibold">{title}</h3><p className="text-sm text-slate-600">{description}</p></Card>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-4"><h1 className="text-2xl font-semibold">{title}</h1>{subtitle ? <p className="text-slate-600">{subtitle}</p> : null}</div>;
}

export function NavLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100">{label}</Link>;
}
