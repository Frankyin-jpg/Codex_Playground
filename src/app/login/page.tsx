import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LoginPage() {
  const users = await prisma.user.findMany({ take: 10, orderBy: { createdAt: "asc" } });
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <p className="mb-4 text-sm text-slate-600">Use a seeded user to sign in.</p>
      <form action={async (fd) => {"use server"; await signIn("credentials", { email: String(fd.get("email")), redirectTo: "/app/dashboard" });}} className="space-y-3">
        <select name="email" className="w-full rounded border p-2" required>
          {users.map((user) => <option key={user.id} value={user.email}>{user.email} ({user.role})</option>)}
        </select>
        <button className="w-full rounded bg-slate-900 px-4 py-2 text-white">Continue</button>
      </form>
    </main>
  );
}
