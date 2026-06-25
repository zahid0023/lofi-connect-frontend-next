"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, CheckCircle2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getSubscriptionPlans, SubscriptionPlan } from "@/services/subscriptions";

export default function ContactSubscriptionPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setIsLoadingPlans(true);
        getSubscriptionPlans()
            .then(data => {
                setPlans(data);
                if (data.length > 0) setSelectedPlanId(data[0].id);
            })
            .catch(() => toast.error("Failed to load subscription plans"))
            .finally(() => setIsLoadingPlans(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
        setIsSending(true);
        try {
            // TODO: wire up to backend contact/subscription inquiry endpoint
            await new Promise(resolve => setTimeout(resolve, 800));
            setSubmitted(true);
            toast.success("Message sent! Our team will be in touch shortly.");
        } catch {
            toast.error("Failed to send your message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <CheckCircle2 className="h-14 w-14 text-primary" />
                <h2 className="text-2xl font-bold">Thank you!</h2>
                <p className="text-muted-foreground max-w-md">
                    We've received your inquiry{selectedPlan ? ` for the ${selectedPlan.name} plan` : ""}. A member of our team will reach out to you at <strong>{form.email}</strong> within 1–2 business days.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Contact Us for Subscription
                </h1>
                <p className="text-muted-foreground">
                    Choose a plan that fits your needs, then fill in your details and our team will get you set up.
                </p>
            </div>

            {/* Plan cards */}
            <div className="space-y-3">
                <p className="text-sm font-medium">Select a Plan <span className="text-destructive">*</span></p>
                {isLoadingPlans ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    </div>
                ) : plans.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No plans available at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {plans.map(plan => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                                <button
                                    key={plan.id}
                                    type="button"
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className={`relative w-full rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border hover:border-muted-foreground/30"
                                    }`}
                                >
                                    {isSelected && (
                                        <span className="absolute right-3 top-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </span>
                                    )}

                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                                        {plan.name}
                                    </p>

                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-3xl font-bold">
                                            {parseFloat(plan.price) === 0 ? "Free" : `$${parseFloat(plan.price).toFixed(2)}`}
                                        </span>
                                        {parseFloat(plan.price) > 0 && (
                                            <span className="text-sm text-muted-foreground mb-0.5">
                                                {plan.billing_cycle === "ANNUAL" ? "/ yr" : "/ mo"}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="space-y-2">
                                        {plan.description.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            placeholder="John Smith"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input
                        id="company"
                        placeholder="Acme Corp"
                        value={form.company}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                    <Textarea
                        id="message"
                        placeholder="Tell us about your use case and what you're looking for in a plan..."
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedPlanId || !form.name.trim() || !form.email.trim() || !form.message.trim() || isSending || isLoadingPlans}
                >
                    {isSending ? (
                        "Sending..."
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Inquiry{selectedPlan ? ` for ${selectedPlan.name}` : ""}
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
