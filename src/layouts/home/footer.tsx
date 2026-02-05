import { ZapIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <ZapIcon className="h-5 w-5 text-primary" />
          <span className="font-semibold">LofiConnect</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LofiConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
