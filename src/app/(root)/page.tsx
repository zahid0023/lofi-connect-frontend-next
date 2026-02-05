import {
  ArrowRight,
  ArrowRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  KeyIcon,
  Link2Icon,
  ShieldIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockPlans } from "@/services/mockData";

const features = [
  {
    icon: KeyIcon,
    title: "Static API Keys",
    description:
      "Generate persistent API keys that never expire. No more OAuth token headaches.",
  },
  {
    icon: Link2Icon,
    title: "Easy GHL Connections",
    description:
      "Connect your GoHighLevel accounts in seconds with our streamlined OAuth flow.",
  },
  {
    icon: BarChart3Icon,
    title: "Usage Analytics",
    description:
      "Monitor your API usage with detailed charts and real-time metrics.",
  },
  {
    icon: ShieldIcon,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with encrypted keys and secure connections.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Developer Portal
        </Badge>
        <h1 className="mb-6 font-bold text-5xl tracking-tight md:text-6xl">
          Simplify Your <span className="text-primary">GoHighLevel</span>{" "}
          Integrations
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          LofiConnect provides static API keys for GoHighLevel, eliminating the
          complexity of OAuth tokens. Connect once, integrate forever.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start for Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl">
            Everything You Need to Integrate
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <feature.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center font-bold text-3xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Start free, scale as you grow
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {mockPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border bg-card p-6 ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="-top-3 -translate-x-1/2 absolute left-1/2">
                    Most Popular
                  </Badge>
                )}
                <h3 className="mb-2 font-bold text-xl">{plan.name}</h3>
                <div className="mb-4">
                  <span className="font-bold text-4xl">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2Icon className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-bold text-3xl">
            Ready to Simplify Your Integrations?
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Join developers who are building with LofiConnect
          </p>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            Create Free Account <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
