"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
        <Input id="name" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <Input id="email" type="email" placeholder="your@email.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company</label>
        <Input id="company" placeholder="Company name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea id="message" rows={6} required placeholder="How can we help?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-tertiary resize-none transition-colors duration-200 focus:border-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
      </div>
      <Button type="submit" variant="primary" size="md">Send Message</Button>
    </form>
  );
}