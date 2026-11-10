"use client";

import { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { createClient } from "@/lib/supabase/client";

export default function AdminOptionsPage() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStrategies = async () => {
      const { data } = await supabase.from("options_strategies").select("*");
      if (data) setStrategies(data);
      setLoading(false);
    };
    fetchStrategies();
  }, [supabase]);

  const handleUpdate = async (id: string, updates: any) => {
    await supabase.from("options_strategies").update(updates).eq("id", id);
    alert("Strategy updated!");
  };

  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Options Strategies" description="Manage dynamic options showcase pages." />
        
        <div className="mt-12 space-y-8">
          {strategies.map((s) => (
            <div key={s.id} className="rounded-md border border-border bg-surface p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">{s.name}</h2>
                <a href={`/strategies/india/options/${s.slug}`} target="_blank" className="text-sm underline text-secondary">
                  View Page ↗
                </a>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                handleUpdate(s.id, {
                  description: (form.elements.namedItem("description") as HTMLInputElement).value,
                  streamlit_url: (form.elements.namedItem("streamlit_url") as HTMLInputElement).value,
                  contact_url: (form.elements.namedItem("contact_url") as HTMLInputElement).value,
                });
              }}>
                <label className="block text-sm">
                  <span className="text-secondary">Description</span>
                  <input name="description" defaultValue={s.description} className="mt-1 w-full bg-background border border-border p-2 text-sm text-foreground rounded" />
                </label>
                <label className="block text-sm">
                  <span className="text-secondary">Streamlit URL</span>
                  <input name="streamlit_url" defaultValue={s.streamlit_url} placeholder="http://..." className="mt-1 w-full bg-background border border-border p-2 text-sm text-foreground rounded" />
                </label>
                <label className="block text-sm md:col-span-2">
                  <span className="text-secondary">Contact URL (button link)</span>
                  <input name="contact_url" defaultValue={s.contact_url} className="mt-1 w-full bg-background border border-border p-2 text-sm text-foreground rounded" />
                </label>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-foreground text-background px-4 py-2 rounded text-sm font-medium hover:opacity-90">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
