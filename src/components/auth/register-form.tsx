"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type RegisterDto, registerDto } from "@/validations/auth.dto";

interface PasswordRequirement {
  met: boolean;
  text: string;
}

interface PasswordStrength {
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  color: string;
  requirements: PasswordRequirement[];
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const requirements: PasswordRequirement[] = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(password), text: "One lowercase letter" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    {
      met: /[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password),
      text: "One number or special character",
    },
  ];

  const metCount = requirements.filter((req) => req.met).length;
  const score = (metCount / requirements.length) * 100;

  let level: PasswordStrength["level"];
  let color: string;

  if (score <= 25) {
    level = "weak";
    color = "bg-destructive";
  } else if (score <= 50) {
    level = "fair";
    color = "bg-warning";
  } else if (score <= 75) {
    level = "good";
    color = "bg-primary";
  } else {
    level = "strong";
    color = "bg-success";
  }

  return { score, level, color, requirements };
};

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerDto),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password || ""),
    [password],
  );

  async function onSubmit(data: RegisterDto) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/registration/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*"
          },
          body: JSON.stringify({
            user_name: data.email,
            password: data.password,
            confirm_password: data.password
          }),
        },
      );
      if (response.status === 201) {
        toast.success("User create successful!!",
          {
            position: "bottom-right",
            classNames: {
              content: "flex flex-col gap-2",
            },
            style: {
              "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
          }
        );
        router.push("/login");
        return;
      }

      // Handle non-201 responses
      const errorBody = await response.json().catch(() => null);
      toast.error(errorBody?.message || "Registration failed");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="john@example.com"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
                autoComplete="off"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              {password && (
                <div
                  id="password-strength"
                  className="space-y-3"
                  role="status"
                  aria-live="polite"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Password strength
                      </span>
                      <span
                        className={
                          passwordStrength.level === "strong"
                            ? "font-medium text-success"
                            : "text-muted-foreground"
                        }
                      >
                        {passwordStrength.level.charAt(0).toUpperCase() +
                          passwordStrength.level.slice(1)}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength.score}
                      className={cn(
                        `*:data-[slot='progress-indicator']:${passwordStrength.color}`,
                      )}
                      aria-label={`Password strength: ${passwordStrength.level}`}
                    />
                  </div>

                  <ul
                    className="space-y-1.5"
                    aria-label="Password requirements"
                  >
                    {passwordStrength.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-xs"
                      >
                        {req.met ? (
                          <CheckCircle2Icon
                            className="size-3.5 shrink-0 text-success"
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircleIcon
                            className="size-3.5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            req.met
                              ? "text-success transition-colors"
                              : "text-muted-foreground"
                          }
                        >
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-4 w-full"
      >
        {form.formState.isSubmitting && <Spinner />}
        Create account
      </Button>
    </form>
  );
}
