import { pricingPlans } from "@/lib/constants";
import { getPriceIdForActiveUser } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PlanBadge() {
  const user = await currentUser();

  if (!user?.id) return null;

  const email = user.emailAddresses?.[0]?.emailAddress;

  let priceId: string | null = null;

  if (email) {
    priceId = await getPriceIdForActiveUser(email);
  }

  let planName = "No plan";

  const plan = pricingPlans.find((plan) => plan.priceId === priceId);

  if (plan) {
    planName = plan.name;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-2 flex items-center gap-1 border rounded-full text-sm font-semibold border-blue-600 text-blue-600 bg-blue-100"
      )}
    >
      <Crown className={cn("w-4 h-4 text-blue-600")} />
      {planName}
    </Badge>
  );
}
