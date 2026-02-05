import { ZapIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ZapIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">LofiConnect</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Log in
          </Link>
          <Link href="/signup" className={cn(buttonVariants())}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
