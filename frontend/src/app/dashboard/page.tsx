import Link from "next/link";

// TODO: Replace with real data from API
const userProfile = { username: "demo", verified: true };

const memorials = [
  {
    slug: "abdul-sattar-edhi",
    name: "Abdul Sattar Edhi",
    dob: "1928-01-01",
    dod: "2016-07-08",
    bio: "Abdul Sattar Edhi was a Pakistani philanthropist, ascetic and humanitarian who founded the Edhi Foundation.",
    cover_image: null as string | null,
    visibility: "public" as const,
    donations_count: 150,
    trees_planted_count: 75,
    memories_count: 42,
  },
  {
    slug: "nusrat-fateh-ali-khan",
    name: "Ustad Nusrat Fateh Ali Khan",
    dob: "1948-10-13",
    dod: "1997-08-16",
    bio: "Nusrat Fateh Ali Khan was a Pakistani musician, primarily a singer of Qawwali, the devotional music of the Sufis.",
    cover_image: null as string | null,
    visibility: "public" as const,
    donations_count: 200,
    trees_planted_count: 100,
    memories_count: 67,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const totalMemories = memorials.reduce((s, m) => s + m.memories_count, 0);
  const totalContributions = memorials.reduce((s, m) => s + m.donations_count + m.trees_planted_count, 0);

  return (
    <div className="bg-gradient-dashboard">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8 p-8 rounded-xl shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {userProfile.username}!
          </h1>
          <p className="text-text-muted mb-3">Manage your memorials and preserve precious memories</p>
          {!userProfile.verified && (
            <span className="inline-flex items-center px-3 py-2 rounded-md bg-warning text-white text-sm font-medium mt-2">
              <i className="fas fa-exclamation-circle mr-1" />Email Verification Pending &mdash;{" "}
              <Link href="/verify" className="text-white underline ml-1">Verify Now</Link>
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "fa-heart", color: "text-primary", value: memorials.length, label: `Memorial${memorials.length !== 1 ? "s" : ""}` },
            { icon: "fa-comments", color: "text-success", value: totalMemories, label: "Total Memories" },
            { icon: "fa-tree", color: "text-success", value: totalContributions, label: "Contributions" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gradient-card rounded-lg shadow-sm text-center py-6 px-4 hover:-translate-y-1 transition-transform">
              <i className={`fas ${stat.icon} text-4xl ${stat.color} mb-3`} />
              <h2 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h2>
              <p className="text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* My Memorials */}
        <div className="bg-gradient-card rounded-lg shadow-sm">
          <div className="p-6 border-b border-border-light">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold text-primary">
                <i className="fas fa-heart mr-2" />My Memorials
              </h4>
              {userProfile.verified && (
                <Link href="/memorial/new" className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                  <i className="fas fa-plus mr-1" />Create New
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {memorials.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {memorials.map((memorial) => (
                  <div key={memorial.slug} className="bg-gradient-card rounded-lg shadow-sm hover:-translate-y-1 transition-transform overflow-hidden">
                    <div className="flex h-full">
                      <div className="w-1/3">
                        {memorial.cover_image ? (
                          <img src={memorial.cover_image} className="w-full h-full object-cover" alt={memorial.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center min-h-[160px] bg-gradient-to-br from-primary/10 to-primary/5">
                            <i className="fas fa-user text-4xl text-primary opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="w-2/3 p-4 flex flex-col">
                        <div className="flex-1">
                          <h6 className="font-bold text-primary mb-1">{memorial.name}</h6>
                          {memorial.dob && memorial.dod && (
                            <p className="text-xs text-text-muted mb-2">
                              <i className="fas fa-calendar-alt mr-1" />
                              {formatDate(memorial.dob)} - {formatDate(memorial.dod)}
                            </p>
                          )}
                          <p className="text-sm text-text-muted mb-3">
                            {memorial.bio.split(" ").slice(0, 12).join(" ")}...
                          </p>
                          <div className="flex gap-2 mb-3">
                            {[
                              { icon: "fa-heart", bg: "bg-success", value: memorial.donations_count },
                              { icon: "fa-tree", bg: "bg-primary", value: memorial.trees_planted_count },
                              { icon: "fa-comment", bg: "bg-primary/75", value: memorial.memories_count },
                            ].map((b) => (
                              <span key={b.icon} className={`inline-flex items-center px-2 py-0.5 rounded-md ${b.bg} text-white text-xs font-medium`}>
                                <i className={`fas ${b.icon} mr-1`} />{b.value}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-white text-xs font-medium ${memorial.visibility === "public" ? "bg-success" : "bg-text-muted"}`}>
                            <i className={`fas fa-${memorial.visibility === "public" ? "globe" : "lock"} mr-1`} />
                            {memorial.visibility === "public" ? "Public" : "Private"}
                          </span>
                          <Link href={`/m/${memorial.slug}`} className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                            <i className="fas fa-eye mr-1" />View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-heart text-5xl text-primary opacity-25 mb-4 block" />
                <h4 className="text-primary mb-2">No memorials yet</h4>
                {userProfile.verified ? (
                  <>
                    <p className="text-text-muted mb-4">Create your first memorial to preserve memories of someone special.</p>
                    <Link href="/memorial/new" className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium shadow hover:bg-primary-dark transition-colors">
                      <i className="fas fa-plus mr-2" />Create Your First Memorial
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-text-muted mb-4">Please verify your email address to start creating memorials.</p>
                    <Link href="/verify" className="inline-flex items-center px-6 py-3 rounded-md bg-warning text-white text-lg font-medium shadow hover:brightness-110 transition-all">
                      <i className="fas fa-envelope mr-2" />Verify Email Address
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
