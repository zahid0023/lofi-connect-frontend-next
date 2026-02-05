"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  type ForgotPasswordDto,
  forgotPasswordDto,
} from "@/validations/auth.dto";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordDto),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordDto) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code className="text-muted-foreground">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
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
      </FieldGroup>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-4 w-full"
      >
        {form.formState.isSubmitting && <Spinner />}
        Send reset link
      </Button>
    </form>
  );
}
