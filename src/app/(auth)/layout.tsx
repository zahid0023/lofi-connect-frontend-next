import { ZapIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-primary p-12 lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/login"
          className="flex items-center gap-2 text-primary-foreground"
        >
          <ZapIcon className="h-8 w-8" />
          <span className="font-bold text-2xl">LofiConnect</span>
        </Link>

        <div className="space-y-6">
          <h1 className="font-bold text-4xl text-primary-foreground">
            Simplify your GoHighLevel integrations
          </h1>
        </div>

        <p className="text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} LofiConnect. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex w-full flex-col px-8 lg:w-1/2 lg:px-16">
        <div className="flex items-center justify-between pt-4 lg:justify-end">
          <div className="lg:hidden">
            <Link href="/login" className="flex items-center gap-2 text-foreground">
              <ZapIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">LofiConnect</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
