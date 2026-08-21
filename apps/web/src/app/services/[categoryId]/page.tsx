import { notFound } from "next/navigation";
import { getServiceById } from "@/features/services/services/catalog";
import { ServiceListItem } from "@/features/services/components/ServiceListItem";
import { layoutContainer, sectionPadding } from "@/lib/design-system";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

// This is a server component
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = getServiceById(categoryId);

  if (!category) {
    notFound();
  }

  // Get the subservices or fallback to empty array
  const subServices = category.subServices || [];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className={layoutContainer}>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl md:text-5xl">
            {category.name}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: List of Services */}
          <div className="flex-1 bg-card rounded-3xl border border-border/40 p-6 sm:p-8 shadow-sm">
            {subServices.length > 0 ? (
              <div className="flex flex-col">
                {subServices.map((subService) => (
                  <ServiceListItem key={subService.id} service={subService} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                <p>No specific services listed for this category yet.</p>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-28 space-y-6">
              
              {/* QuickDidi Promise */}
              <div className="bg-card rounded-3xl border border-border/40 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">QuickDidi Promise</h3>
                <ul className="space-y-3">
                  {(category.promise || ["Verified Professionals", "Safe Chemicals", "Superior Stain Removal"]).map((promise, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      {promise}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop Cart Summary (In a real app, this would be a custom inline cart component, but here we show a placeholder box that works alongside the CartSheet) */}
              <div className="hidden lg:block bg-card rounded-3xl border border-border/40 p-6 shadow-sm text-center">
                <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">Your Cart</h3>
                <p className="text-sm text-muted-foreground mb-4">Items added to your cart will appear here.</p>
                {/* The global CartSheet trigger from navbar is usually enough, but we can instruct them to open it */}
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  Click the cart icon in the navigation bar to checkout.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
