"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { Spinner } from "@/components/ui/spinner";
import { type LoginDto, loginDto } from "@/validations/auth.dto";
import { login } from "@/services/auth";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginDto),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  async function onSubmit(data: LoginDto) {
    try {
      await login({ user_name: data.email, password: data.password });
      toast.success("Login successful");
      router.push("/portal");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
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
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
                autoComplete="off"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
        Sign in
      </Button>
    </form>
  );
}
