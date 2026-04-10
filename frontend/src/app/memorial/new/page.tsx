"use client";

import Link from "next/link";
import { useState } from "react";
import { memorialSchema, type MemorialInput } from "@/validations/memorial";

export default function CreateMemorialPage() {
  const [form, setForm] = useState<MemorialInput>({ name: "", dob: "", dod: "", bio: "", visibility: "public" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const isEdit = false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = memorialSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // TODO: Implement real form submission via API
  };

  const sections = [
    {
      icon: "fa-user-circle",
      title: "Basic Information",
      content: (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
              Name <span className="text-danger font-bold">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full rounded-md border py-2.5 px-3 text-base outline-none transition-all ${
                errors.name ? "border-danger focus:ring-danger/15" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
              }`}
              placeholder="Full name of the person"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name ? (
              <p className="text-sm text-danger mt-1">{errors.name}</p>
            ) : (
              <p className="text-sm text-text-secondary mt-1"><i className="fas fa-info-circle mr-1" />The full name of the person being memorialized</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-text mb-1.5">Date of Birth</label>
              <input type="date" id="dob" name="dob" className="w-full rounded-md border border-border py-2.5 px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" value={form.dob} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="dod" className="block text-sm font-medium text-text mb-1.5">Date of Passing</label>
              <input type="date" id="dod" name="dod" className="w-full rounded-md border border-border py-2.5 px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" value={form.dod} onChange={handleChange} />
            </div>
          </div>
        </>
      ),
    },
    {
      icon: "fa-book-open",
      title: "Life Story",
      content: (
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-text mb-1.5">Biography</label>
          <textarea
            id="bio"
            name="bio"
            className="w-full rounded-md border border-border py-2.5 px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-vertical min-h-36"
            rows={6}
            placeholder="Share their story, achievements, and what made them special..."
            value={form.bio}
            onChange={handleChange}
          />
          <p className="text-sm text-text-secondary mt-1"><i className="fas fa-pen mr-1" />Share their story, achievements, personality, and what made them special</p>
        </div>
      ),
    },
    {
      icon: "fa-image",
      title: "Photo & Settings",
      content: (
        <>
          <div className="mb-4">
            <label htmlFor="cover_image" className="block text-sm font-medium text-text mb-1.5">Cover Photo</label>
            <input type="file" id="cover_image" className="w-full rounded-md border border-border py-2.5 px-3 text-base" accept="image/*" />
            <p className="text-sm text-text-secondary mt-1"><i className="fas fa-camera mr-1" />A meaningful photo that represents them well</p>
          </div>
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-text mb-1.5">Privacy Setting</label>
            <select
              id="visibility"
              name="visibility"
              className="w-full rounded-md border border-border py-2.5 px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              value={form.visibility}
              onChange={handleChange}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <p className="text-sm text-text-secondary mt-1">
              <i className="fas fa-lock mr-1" />
              <strong>Public:</strong> Anyone can view and add memories &middot; <strong>Private:</strong> Only you can manage this memorial
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-primary py-8">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-2xl font-bold mb-2">
            <i className={`fas fa-${isEdit ? "edit" : "heart"} mr-2`} />
            {isEdit ? "Edit" : "Create a"} Memorial
          </h1>
          <p>{isEdit ? "Update the memorial details" : "Preserve a lasting tribute for someone special"}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Help Box */}
        <div className="bg-gradient-help p-5 rounded-xl mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <i className="fas fa-lightbulb text-lg text-primary mt-1" />
            <div>
              <h6 className="font-bold text-primary mb-2"><i className="fas fa-info-circle mr-1" />Quick Guide</h6>
              <p className="text-sm text-text-muted">
                Creating a memorial is a meaningful way to preserve someone&apos;s memory. Fill out the form below with as much detail as you&apos;d like. All fields can be edited later.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} noValidate>
              {sections.map((section, i) => (
                <div key={section.title}>
                  {i > 0 && <hr className="border-border-light my-8" />}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 pb-2 inline-flex items-center gap-2 border-b-3 border-accent">
                      <i className={`fas ${section.icon} text-accent`} />
                      {section.title}
                    </h3>
                    {section.content}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border-light">
                <Link href="/dashboard" className="inline-flex items-center px-4 py-2 rounded-md border-2 border-border text-text-secondary font-medium hover:bg-border-light transition-all">
                  <i className="fas fa-arrow-left mr-2" />Cancel
                </Link>
                <button type="submit" className="inline-flex items-center px-8 py-3 rounded-md bg-primary text-white text-lg font-medium shadow-sm hover:bg-primary-dark hover:-translate-y-0.5 transition-all">
                  <i className={`fas fa-${isEdit ? "save" : "heart"} mr-2`} />
                  {isEdit ? "Update Memorial" : "Create Memorial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
