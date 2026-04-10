"use client";

import Link from "next/link";
import { useState, use } from "react";

// TODO: Fetch from API based on slug
const mockMemorial = {
  slug: "abdul-sattar-edhi",
  name: "Abdul Sattar Edhi",
  dob: "1928-01-01",
  dod: "2016-07-08",
  bio: "Abdul Sattar Edhi was a Pakistani philanthropist, ascetic and humanitarian who founded the Edhi Foundation, which runs the world's largest volunteer ambulance network, along with homeless shelters, animal shelter, rehab centres, and orphanages across Pakistan.\n\nHe was known as the Angel of Mercy and is considered one of the most generous and selfless individuals in Pakistan's history. His life's work embodied the spirit of giving and compassion that transcends all boundaries.",
  cover_image: null as string | null,
  visibility: "public",
  donations_count: 150,
  trees_planted_count: 75,
  created_at: "2024-01-15",
  owner: { username: "demo" },
};

const mockMemories = [
  {
    id: 1,
    author: { username: "sarah_k" },
    type: "text" as "text" | "image" | "video",
    content: "Edhi Sahab's ambulance saved my grandfather's life in 1995. Our family will forever be grateful for his selfless service to humanity.",
    image: null as string | null,
    video_url: null as string | null,
    created_at: "2024-03-15",
  },
  {
    id: 2,
    author: { username: "ahmed_r" },
    type: "text" as "text" | "image" | "video",
    content: "I grew up in one of Edhi Foundation's orphanages. He gave us hope when we had nothing. A true father to the nation.",
    image: null as string | null,
    video_url: null as string | null,
    created_at: "2024-02-20",
  },
];

const user = null as null | { username: string };
const canEdit = false;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function MemorialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const memorial = mockMemorial;
  const memories = mockMemories;
  const [memoryType, setMemoryType] = useState("text");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const totalContributions = memorial.donations_count + memorial.trees_planted_count;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/m/${memorial.slug}`;
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  return (
    <div className="bg-gradient-detail min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <article className="mb-6">
            <div className="bg-gradient-card rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile image */}
                <div className="shrink-0">
                  {memorial.cover_image ? (
                    <img src={memorial.cover_image} alt={`Portrait of ${memorial.name}`} className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-primary/10" />
                  ) : (
                    <div className="w-36 h-36 rounded-full shadow-md flex items-center justify-center border-4 border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5">
                      <i className="fas fa-user text-5xl text-primary opacity-50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-3">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">{memorial.name}</h1>
                      {memorial.dob && memorial.dod && (
                        <p className="text-lg text-text-muted">
                          <i className="fas fa-calendar-alt mr-2" />
                          {formatDate(memorial.dob)} - {formatDate(memorial.dod)}
                        </p>
                      )}
                    </div>
                    <button onClick={handleCopyLink} className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white font-medium shadow-sm hover:bg-primary-dark transition-all" title="Share Memorial">
                      <i className="fas fa-share" />
                    </button>
                  </div>

                  {canEdit && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Link href={`/memorial/${memorial.slug}/edit`} className="inline-flex items-center px-4 py-2 rounded-md border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all">
                        <i className="fas fa-edit mr-2" />Edit Memorial
                      </Link>
                      <button onClick={() => setShowDeleteModal(true)} className="inline-flex items-center px-4 py-2 rounded-md border-2 border-danger text-danger font-medium hover:bg-danger hover:text-white transition-all">
                        <i className="fas fa-trash mr-2" />Delete
                      </button>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: memorial.donations_count, label: "Donations", color: "text-success" },
                      { value: memorial.trees_planted_count, label: "Trees Planted", color: "text-primary" },
                      { value: memories.length, label: "Memories", color: "text-info" },
                      { value: totalContributions, label: "Total Impact", color: "text-warning" },
                    ].map((s) => (
                      <div key={s.label} className="stat-box text-center p-3 rounded-xl shadow-sm">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-text-muted uppercase tracking-wide">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {memorial.bio && (
                <div className="bg-gradient-card rounded-xl shadow-sm bg-gradient-card-hover">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-4">
                      <i className="fas fa-book mr-2" />Biography
                    </h3>
                    <div className="leading-relaxed text-text-secondary whitespace-pre-line">{memorial.bio}</div>
                  </div>
                </div>
              )}

              {/* Memories */}
              <div className="bg-gradient-card rounded-xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    <i className="fas fa-heart mr-2" />Memories{" "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary text-white text-sm font-medium ml-2">{memories.length}</span>
                  </h3>

                  {/* Add Memory Form */}
                  {user ? (
                    <div className="bg-gradient-memory-form mb-6 p-5 rounded-xl shadow-sm">
                      <div className="mb-4">
                        <h5 className="font-bold text-primary mb-1">
                          <i className="fas fa-pen-fancy mr-2" />Share a Memory
                        </h5>
                        <p className="text-sm text-text-muted">
                          <i className="fas fa-info-circle mr-1" />
                          Share a special memory, story, or moment you had with {memorial.name}
                        </p>
                      </div>
                      <form>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              <i className="fas fa-list mr-1 text-primary" />Memory Type
                            </label>
                            <select className="w-full rounded-md border border-border py-2 px-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none" value={memoryType} onChange={(e) => setMemoryType(e.target.value)}>
                              <option value="text">Text</option>
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            {memoryType === "text" && (
                              <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1"><i className="fas fa-comment-alt mr-1 text-primary" />Your Memory</label>
                                <textarea className="w-full rounded-md border border-border py-2 px-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none resize-vertical min-h-20" rows={3} placeholder="Share your favorite memory..." />
                              </div>
                            )}
                            {memoryType === "image" && (
                              <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1"><i className="fas fa-camera mr-1 text-primary" />Upload Image</label>
                                <input type="file" className="w-full rounded-md border border-border py-2 px-3 text-base" accept="image/*" />
                              </div>
                            )}
                            {memoryType === "video" && (
                              <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1"><i className="fas fa-video mr-1 text-primary" />Video URL</label>
                                <input type="url" className="w-full rounded-md border border-border py-2 px-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none" placeholder="https://youtube.com/..." />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-primary/10">
                          <small className="text-text-muted"><i className="fas fa-heart mr-1" />Your memory will be shared with love and respect</small>
                          <button type="submit" className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium shadow-sm hover:bg-primary-dark hover:-translate-y-0.5 transition-all">
                            <i className="fas fa-plus mr-2" />Share Memory
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-accent/10 border-l-4 border-accent px-4 py-3 mb-6 text-accent-dark shadow-sm">
                      <i className="fas fa-info-circle mr-2" />
                      <Link href="/login" className="font-bold">Log in</Link> to share your memories of {memorial.name}.
                    </div>
                  )}

                  {/* Memories List */}
                  <div>
                    {memories.length > 0 ? memories.map((memory) => (
                      <div key={memory.id} className="memory-item">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            {memory.author.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <strong className="text-primary">{memory.author.username}</strong>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-white text-xs font-medium ml-2">
                                  {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
                                </span>
                              </div>
                              <small className="text-text-muted">{formatDate(memory.created_at)}</small>
                            </div>
                            {memory.type === "text" && memory.content && (
                              <div className="text-text-secondary whitespace-pre-line">{memory.content}</div>
                            )}
                            {memory.type === "video" && memory.video_url && (
                              <a href={memory.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 rounded-md border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all">
                                <i className="fas fa-play mr-2" />Watch Video
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <i className="fas fa-heart text-4xl text-primary mb-3 block opacity-25" />
                        <p className="text-text-muted">No memories shared yet. Be the first to share a memory of {memorial.name}.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Contributions */}
              <div className="bg-gradient-card rounded-xl shadow-sm">
                <div className="p-6 text-center">
                  <h4 className="text-lg font-bold text-primary mb-2">
                    <i className="fas fa-hands-helping mr-2" />Honor Their Memory
                  </h4>
                  <p className="text-sm text-text-muted mb-4">Make a meaningful contribution in memory of {memorial.name}</p>
                  {user ? (
                    <div className="space-y-3">
                      <button className="w-full inline-flex flex-col items-center px-4 py-3 rounded-md bg-success text-white font-medium shadow-sm hover:brightness-110 hover:-translate-y-0.5 transition-all">
                        <span><i className="fas fa-heart mr-2" />Donate</span>
                        <span className="text-xs mt-1 opacity-75">Current: {memorial.donations_count}</span>
                      </button>
                      <button className="w-full inline-flex flex-col items-center px-4 py-3 rounded-md bg-primary text-white font-medium shadow-sm hover:bg-primary-dark hover:-translate-y-0.5 transition-all">
                        <span><i className="fas fa-tree mr-2" />Plant a Tree</span>
                        <span className="text-xs mt-1 opacity-75">Current: {memorial.trees_planted_count}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-accent/10 border-l-4 border-accent px-4 py-3 text-accent-dark shadow-sm">
                      <Link href="/login" className="font-bold">Log in</Link> to make contributions.
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="bg-gradient-card rounded-xl shadow-sm">
                <div className="p-6">
                  <h5 className="text-lg font-bold text-primary mb-4">
                    <i className="fas fa-info-circle mr-2" />Memorial Details
                  </h5>
                  <div className="space-y-3">
                    {[
                      { label: "Created by", value: <span className="font-semibold text-primary">{memorial.owner.username}</span> },
                      { label: "Created", value: <span className="font-semibold">{formatDate(memorial.created_at)}</span> },
                      { label: "Visibility", value: <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-white text-xs font-medium ${memorial.visibility === "public" ? "bg-success" : "bg-text-muted"}`}>{memorial.visibility === "public" ? "Public" : "Private"}</span> },
                      ...(memorial.dob ? [{ label: "Born", value: <span className="font-semibold">{formatDate(memorial.dob)}</span> }] : []),
                      ...(memorial.dod ? [{ label: "Passed", value: <span className="font-semibold">{formatDate(memorial.dod)}</span> }] : []),
                    ].map((detail, i, arr) => (
                      <div key={detail.label} className={i < arr.length - 1 ? "pb-3 border-b border-border-light" : ""}>
                        <div className="text-xs text-text-muted mb-1">{detail.label}</div>
                        {detail.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl max-w-2xl w-full mx-4 border-2 border-danger">
            <div className="bg-danger text-white p-4 rounded-t-xl flex items-center justify-between">
              <h5 className="font-bold"><i className="fas fa-exclamation-triangle mr-2" />DELETE MEMORIAL - PERMANENT ACTION</h5>
              <button onClick={() => setShowDeleteModal(false)} className="text-white hover:opacity-80"><i className="fas fa-times" /></button>
            </div>
            <div className="p-6">
              <h6 className="text-danger font-bold text-lg mb-3">
                You are about to permanently delete the memorial for <span className="underline">{memorial.name}</span>
              </h6>
              <div className="bg-danger/10 border border-danger rounded-lg p-4 mb-4">
                <h6 className="font-bold text-danger mb-2"><i className="fas fa-trash-alt mr-2" />The following will be PERMANENTLY DELETED:</h6>
                <ul className="list-disc pl-5 space-y-1 text-text">
                  <li><strong>{memories.length}</strong> memories shared by friends and family</li>
                  <li><strong>{memorial.donations_count}</strong> donation records</li>
                  <li><strong>{memorial.trees_planted_count}</strong> tree planting records</li>
                  <li>Cover photo and all media files</li>
                  <li>Complete biography and life story</li>
                </ul>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10 border-2 border-warning">
                <p className="font-bold text-lg text-danger"><i className="fas fa-question-circle mr-2" />Are you absolutely certain?</p>
              </div>
            </div>
            <div className="flex justify-between p-4 bg-surface-muted rounded-b-xl">
              <button onClick={() => setShowDeleteModal(false)} className="inline-flex items-center px-5 py-3 rounded-md bg-success text-white text-lg font-medium shadow-sm hover:brightness-110 transition-all">
                <i className="fas fa-shield-alt mr-2" />No, Keep Safe
              </button>
              <button className="inline-flex items-center px-5 py-3 rounded-md bg-danger text-white text-lg font-medium shadow-sm hover:brightness-110 transition-all">
                <i className="fas fa-trash-alt mr-2" />YES, DELETE FOREVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
