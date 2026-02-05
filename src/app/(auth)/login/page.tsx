import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
      <div className="mt-8 rounded-lg border bg-muted/50 p-4">
        <p className="mb-2 text-sm font-medium">Demo Credentials</p>
        <p className="text-xs text-muted-foreground">
          <strong>User:</strong> john@example.com (any password)
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Admin:</strong> jane@example.com (any password)
        </p>
      </div>
    </div>
  );
}
