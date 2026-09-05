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

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your ProjectMentor Account" },
      {
        name: "description",
        content: "Start building the right final-year project with AI.",
      },
      { property: "og:title", content: "Create Your ProjectMentor Account" },
      {
        property: "og:description",
        content: "Start building the right final-year project with AI.",
      },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e["name"] = "Full name is required.";
    if (!form.email.trim()) e["email"] = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e["email"] = "Enter a valid email.";
    if (form.password.length < 8) e["password"] = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e["confirm"] = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.name.trim() },
      },
    });
    setLoading(false);
    if (error) {
      const msg = /already/i.test(error.message)
        ? "An account with this email already exists. Try signing in."
        : error.message;
      setErrors({ form: msg });
      toast.error(msg);
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      await supabase
        .from("profiles")
        .update({ full_name: form.name.trim() })
        .eq("id", data.session.user.id);
      toast.success("Account created. Let's set up your profile.");
      navigate({ to: "/onboarding" });
    } else {
      toast.success("Account created. Check your email to confirm, then sign in.");
      navigate({ to: "/login" });
    }
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
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthLayout
      title="Create Your ProjectMentor Account"
      subtitle="Start building the right final-year project with AI."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={form.name}
            autoComplete="name"
            aria-invalid={!!errors["name"]}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            aria-invalid={!!errors["email"]}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            aria-invalid={!!errors["password"]}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors["password"] && <p className="text-xs text-destructive">{errors["password"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            aria-invalid={!!errors["confirm"]}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {errors["confirm"] && <p className="text-xs text-destructive">{errors["confirm"]}</p>}
        </div>
        {errors["form"] && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errors["form"]}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          Create Account
        </Button>
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
