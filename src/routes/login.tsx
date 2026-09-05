import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ProjectMentor AI" },
      {
        name: "description",
        content: "Continue building your project with your AI mentor.",
      },
      { property: "og:title", content: "Sign In — ProjectMentor AI" },
      {
        property: "og:description",
        content: "Continue building your project with your AI mentor.",
      },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("Incorrect email or password. Please try again.");
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (resetError) toast.error(resetError.message);
    else toast.success("Password reset email sent.");
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Continue building your project with your AI mentor."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          Sign In
        </Button>
        <button
          type="button"
          onClick={resetPassword}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Forgot Password?
        </button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={google}>
        Continue with Google
      </Button>
    </AuthLayout>
  );
}
