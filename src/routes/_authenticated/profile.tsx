import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — ProjectMentor AI" },
      { name: "description", content: "Update your skills, interests and constraints so AI advice stays accurate." },
      { property: "og:title", content: "My Profile — ProjectMentor AI" },
      { property: "og:description", content: "Update your skills, interests and constraints so AI advice stays accurate." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      college: profile.college ?? "",
      degree: profile.degree ?? "",
      branch: profile.branch ?? "",
      semester: profile.semester ?? "",
      skills: (profile.skills ?? []).join(", "),
      interests: (profile.interests ?? []).join(", "),
      career_goal: profile.career_goal ?? "",
      team_size: String(profile.team_size ?? ""),
      daily_hours: String(profile.daily_hours ?? ""),
      available_weeks: String(profile.available_weeks ?? ""),
      budget: profile.budget ?? "",
      experience_level: profile.experience_level ?? "",
      hardware: profile.hardware ?? "",
    });
  }, [profile]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form["full_name"] ?? "",
        college: form["college"] ?? "",
        degree: form["degree"] ?? "",
        branch: form["branch"] ?? "",
        semester: form["semester"] ?? "",
        skills: (form["skills"] ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        interests: (form["interests"] ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        career_goal: form["career_goal"] ?? "",
        team_size: Number(form["team_size"]) || 1,
        daily_hours: Number(form["daily_hours"]) || 2,
        available_weeks: Number(form["available_weeks"]) || 12,
        budget: form["budget"] ?? "",
        experience_level: form["experience_level"] ?? "",
        hardware: form["hardware"] ?? "",
      })
      .eq("id", u.user!.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries();
    toast.success("Profile updated — future AI advice will use it.");
  };

  const fields: [string, string][] = [
    ["full_name", "Full name"],
    ["college", "College"],
    ["degree", "Degree"],
    ["branch", "Branch"],
    ["semester", "Semester"],
    ["career_goal", "Career goal"],
    ["team_size", "Team size"],
    ["daily_hours", "Hours available per day"],
    ["available_weeks", "Weeks until deadline"],
    ["budget", "Budget"],
    ["experience_level", "Experience level"],
    ["hardware", "Hardware access"],
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything the AI knows about you. Keep it current for better recommendations.
        </p>
      </header>

      <section className="surface-card grid gap-4 p-6 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input id={key} value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Textarea
            id="skills"
            rows={2}
            value={form["skills"] ?? ""}
            onChange={(e) => set("skills", e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5">
            {(profile?.skills ?? []).map((s: string) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="interests">Interests (comma separated)</Label>
          <Textarea
            id="interests"
            rows={2}
            value={form["interests"] ?? ""}
            onChange={(e) => set("interests", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </section>
    </div>
  );
}
