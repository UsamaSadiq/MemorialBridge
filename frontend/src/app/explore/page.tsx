"use client";

import Link from "next/link";
import { useState } from "react";

// TODO: Fetch from API
const mockMemorials = [
  {
    slug: "abdul-sattar-edhi",
    name: "Abdul Sattar Edhi",
    dob: "1928-01-01",
    dod: "2016-07-08",
    bio: "Abdul Sattar Edhi was a Pakistani philanthropist, ascetic and humanitarian who founded the Edhi Foundation.",
    cover_image: null as string | null,
    donations_count: 150,
    trees_planted_count: 75,
    memories_count: 42,
    owner: { username: "demo" },
  },
  {
    slug: "nusrat-fateh-ali-khan",
    name: "Ustad Nusrat Fateh Ali Khan",
    dob: "1948-10-13",
    dod: "1997-08-16",
    bio: "Nusrat Fateh Ali Khan was a Pakistani musician, primarily a singer of Qawwali, the devotional music of the Sufis.",
    cover_image: null as string | null,
    donations_count: 200,
    trees_planted_count: 100,
    memories_count: 67,
    owner: { username: "demo" },
  },
  {
    slug: "madam-noor-jehan",
    name: "Madam Noor Jehan",
    dob: "1926-09-21",
    dod: "2000-12-23",
    bio: "Noor Jehan was a Pakistani singer and actress who is widely regarded as one of the greatest singers in South Asia.",
    cover_image: null as string | null,
    donations_count: 180,
    trees_planted_count: 90,
    memories_count: 55,
    owner: { username: "demo" },
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockMemorials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Explore Memorials</h1>
        <p className="text-text-muted">Discover and preserve the memories of your loved ones</p>
      </div>

      {/* Search */}
      <div className="bg-surface shadow-sm rounded-xl p-4 mb-6">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon" />
          <input
            type="text"
            className="w-full rounded-md border border-border py-3 pl-12 pr-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
            placeholder="Search memorials by name, story, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              onClick={() => setSearchQuery("")}
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>
      </div>

      {/* Results info */}
      {searchQuery ? (
        <div className="rounded-lg bg-accent/10 border-l-4 border-accent px-4 py-3 flex justify-between items-center mb-4 text-accent-dark">
          <span>
            <i className="fas fa-search mr-2" />
            Showing results for &quot;<strong>{searchQuery}</strong>&quot; &mdash;{" "}
            <strong>{filtered.length}</strong> memorial{filtered.length !== 1 ? "s" : ""} found
          </span>
          <button
            onClick={() => setSearchQuery("")}
            className="inline-flex items-center px-3 py-1 rounded-md border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all"
          >
            <i className="fas fa-times mr-1" />Clear
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6">
          <span className="text-text-muted">
            Showing <strong>{filtered.length}</strong> memorial{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((memorial) => (
          <div key={memorial.slug}>
            <div className="memorial-card">
              <div className="memorial-card-image-container">
                {memorial.cover_image ? (
                  <img src={memorial.cover_image} className="memorial-card-image" alt={memorial.name} loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-border-light to-border">
                    <i className="fas fa-user text-4xl text-text-light" />
                  </div>
                )}
                <div className="memorial-card-overlay">
                  <Link href={`/m/${memorial.slug}`} className="inline-flex items-center px-3 py-1.5 rounded-md bg-surface text-text text-sm font-medium hover:bg-surface-muted transition-colors">
                    <i className="fas fa-eye mr-1" />View Memorial
                  </Link>
                </div>
                <div className="absolute top-3 right-3 z-[2]">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-success text-white text-xs font-medium">
                    <i className="fas fa-globe mr-1" />Public
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <h5 className="text-lg font-semibold leading-tight mb-1">
                    <Link href={`/m/${memorial.slug}`} className="text-text hover:text-primary transition-colors">
                      {memorial.name}
                    </Link>
                  </h5>
                  {memorial.dob && memorial.dod && (
                    <div className="text-sm text-text-secondary">
                      <i className="fas fa-calendar-alt mr-1" />
                      {new Date(memorial.dob).getFullYear()} - {new Date(memorial.dod).getFullYear()}
                    </div>
                  )}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-3 flex-1">
                  {memorial.bio.split(" ").slice(0, 20).join(" ")}...
                </p>

                {/* Stats */}
                <div className="flex gap-5 py-3 border-y border-border-light mb-3">
                  {[
                    { icon: "fa-heart", color: "text-danger", value: memorial.donations_count },
                    { icon: "fa-tree", color: "text-success", value: memorial.trees_planted_count },
                    { icon: "fa-comment", color: "text-info", value: memorial.memories_count },
                  ].map((s) => (
                    <div key={s.icon} className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                      <i className={`fas ${s.icon} ${s.color}`} />{s.value}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-semibold">
                      {memorial.owner.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm text-text-secondary">{memorial.owner.username}</span>
                  </div>
                  <Link
                    href={`/m/${memorial.slug}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    View <i className="fas fa-arrow-right ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            {searchQuery ? (
              <>
                <i className="fas fa-search text-5xl text-text-light mb-4 block" />
                <h3 className="text-xl text-text-muted mb-2">No memorials found</h3>
                <p className="text-text-muted">
                  Try different keywords or{" "}
                  <button onClick={() => setSearchQuery("")} className="text-primary font-semibold">browse all memorials</button>.
                </p>
              </>
            ) : (
              <>
                <i className="fas fa-heart text-5xl text-text-light mb-4 block" />
                <h3 className="text-xl text-text-muted mb-2">No memorials yet</h3>
                <p className="text-text-muted mb-4">Be the first to create a memorial.</p>
                <Link href="/signup" className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium hover:bg-primary-dark transition-colors">
                  <i className="fas fa-user-plus mr-2" />Sign Up to Create
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
