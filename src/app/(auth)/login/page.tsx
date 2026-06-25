import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/signup" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
