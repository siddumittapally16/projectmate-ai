import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Tell Us About Yourself — ProjectMentor AI" },
      { name: "description", content: "Set up your student profile so the AI can personalize everything." },
      { property: "og:title", content: "Student Onboarding — ProjectMentor AI" },
      { property: "og:description", content: "Set up your student profile so the AI can personalize everything." },
    ],
  }),
  component: Onboarding,
});

const SKILLS = [
  "C", "C++", "Java", "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Machine Learning", "Artificial Intelligence", "Data Science", "IoT", "Cloud", "Cybersecurity",
];
const INTERESTS = [
  "Artificial Intelligence", "Agriculture", "Healthcare", "Education", "Finance",
  "Cybersecurity", "IoT", "Robotics", "Sustainability", "Smart Cities",
];
const GOALS = [
  "Software Developer", "AI/ML Engineer", "Data Scientist", "Cloud Engineer",
  "Cybersecurity Engineer", "Researcher", "Entrepreneur", "Other",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const BUDGETS = ["None", "Under ₹2,000", "₹2,000–₹10,000", "Above ₹10,000"];
const HARDWARE = ["Laptop only", "Laptop + GPU", "IoT kit / sensors", "College lab access"];

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    college: "",
    degree: "",
    branch: "",
    semester: "",
    skills: [] as string[],
    interests: [] as string[],
    career_goal: "AI/ML Engineer",
    team_size: 3,
    available_weeks: 8,
    daily_hours: 3,
    budget: "None",
    experience_level: "Beginner",
    hardware: "Laptop only",
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        ...Object.fromEntries(
          Object.entries(profile).filter(([k, v]) => k in f && v !== null && v !== ""),
        ),
      }));
    }
  }, [profile]);

  const toggle = (key: "skills" | "interests", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!form.skills.length) {
      toast.error("Select at least one skill.");
      return;
    }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...form, id: userData.user!.id, onboarded: true, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved.");
    navigate({ to: "/dashboard" });
  };

  const useDemo = () =>
    setForm((f) => ({
      ...f,
      full_name: f.full_name || "Demo Student",
      college: "Demo Institute of Technology",
      degree: "B.Tech",
      branch: "Computer Science",
      semester: "8",
      skills: ["Python", "React", "SQL", "Machine Learning"],
      interests: ["Agriculture", "Artificial Intelligence"],
      career_goal: "AI/ML Engineer",
      team_size: 3,
      available_weeks: 8,
      daily_hours: 4,
      experience_level: "Intermediate",
    }));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold">Tell Us About Yourself</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The AI uses this to personalize every idea, roadmap and recommendation.
      </p>
      <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={useDemo} type="button">
        <Sparkles className="size-4" aria-hidden /> Fill with demo data
      </Button>

      <form onSubmit={save} className="mt-8 space-y-8">
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Student Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["full_name", "Full Name"],
              ["college", "College"],
              ["degree", "Degree"],
              ["branch", "Branch"],
              ["semester", "Semester"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={(form as Record<string, unknown>)[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...SKILLS, ...form.skills.filter((s) => !SKILLS.includes(s))].map((s) => (
              <Chip key={s} label={s} selected={form.skills.includes(s)} onClick={() => toggle("skills", s)} />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Label htmlFor="custom-skill" className="sr-only">
              Add a custom skill
            </Label>
            <Input
              id="custom-skill"
              placeholder="Add another skill"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const v = customSkill.trim();
                if (!v) return;
                if (!form.skills.includes(v)) setForm({ ...form, skills: [...form.skills, v] });
                setCustomSkill("");
              }}
            >
              Add
            </Button>
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Interests</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {INTERESTS.map((s) => (
              <Chip key={s} label={s} selected={form.interests.includes(s)} onClick={() => toggle("interests", s)} />
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Career Goal</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Chip
                key={g}
                label={g}
                selected={form.career_goal === g}
                onClick={() => setForm({ ...form, career_goal: g })}
              />
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold">Project Constraints</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="team_size">Team size</Label>
              <Input
                id="team_size"
                type="number"
                min={1}
                value={form.team_size}
                onChange={(e) => setForm({ ...form, team_size: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_weeks">Available weeks</Label>
              <Input
                id="available_weeks"
                type="number"
                min={1}
                value={form.available_weeks}
                onChange={(e) => setForm({ ...form, available_weeks: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily_hours">Daily hours</Label>
              <Input
                id="daily_hours"
                type="number"
                min={1}
                value={form.daily_hours}
                onChange={(e) => setForm({ ...form, daily_hours: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Budget</p>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <Chip key={b} label={b} selected={form.budget === b} onClick={() => setForm({ ...form, budget: b })} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Experience level</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    selected={form.experience_level === b}
                    onClick={() => setForm({ ...form, experience_level: b })}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Hardware availability</p>
              <div className="flex flex-wrap gap-2">
                {HARDWARE.map((b) => (
                  <Chip key={b} label={b} selected={form.hardware === b} onClick={() => setForm({ ...form, hardware: b })} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto">
          {saving && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          Save Profile
        </Button>
      </form>
    </div>
  );
}
