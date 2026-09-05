import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="hero-bg flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
          PM
        </span>
        <span className="font-display font-semibold">ProjectMentor AI</span>
      </Link>
      <div className="surface-card w-full max-w-md p-7">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
