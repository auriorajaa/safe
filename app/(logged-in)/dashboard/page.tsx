// app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const user = await currentUser();

  if (!user || !user.emailAddresses?.[0]?.emailAddress) {
    return redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  return <Dashboard userEmail={userEmail} />;
}
