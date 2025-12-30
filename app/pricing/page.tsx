"use client";

import PricingPlans from "@/components/shared/pricing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative">
      
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Optional: Theme Toggle on top-right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="px-4 pt-16">
        <PricingPlans />
      </div>
    </div>
  );
}
