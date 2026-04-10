import Link from "next/link";

// TODO: Fetch from API
const featuredMemorials = [
  {
    slug: "abdul-sattar-edhi",
    name: "Abdul Sattar Edhi",
    dob: "1928-01-01",
    dod: "2016-07-08",
    bio: "Abdul Sattar Edhi was a Pakistani philanthropist, ascetic and humanitarian who founded the Edhi Foundation, which runs the world's largest volunteer ambulance network.",
    cover_image: null as string | null,
    donations_count: 150,
    trees_planted_count: 75,
  },
  {
    slug: "nusrat-fateh-ali-khan",
    name: "Ustad Nusrat Fateh Ali Khan",
    dob: "1948-10-13",
    dod: "1997-08-16",
    bio: "Nusrat Fateh Ali Khan was a Pakistani musician, primarily a singer of Qawwali, the devotional music of the Sufis. He is widely considered one of the greatest voices ever recorded.",
    cover_image: null as string | null,
    donations_count: 200,
    trees_planted_count: 100,
  },
  {
    slug: "madam-noor-jehan",
    name: "Madam Noor Jehan",
    dob: "1926-09-21",
    dod: "2000-12-23",
    bio: "Noor Jehan was a Pakistani singer and actress who is widely regarded as one of the greatest and most influential singers in South Asia.",
    cover_image: null as string | null,
    donations_count: 180,
    trees_planted_count: 90,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-hero min-h-[60vh] flex items-center justify-center relative">
          <div className="max-w-4xl mx-auto text-center py-16 px-4 relative z-10">
            <span className="inline-flex items-center gap-1 bg-primary text-white text-sm px-3 py-1.5 rounded-md mb-4 animate-fade-in">
              <i className="fas fa-heart" />
              Preserving Legacies Since 2025
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up text-black">
              Preserving Memories,
              <br />
              <span className="text-accent">Honoring Lives</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay text-black">
              Create lasting tributes for those who have touched our hearts.
              <br />
              Share memories, celebrate lives, and keep their legacy alive forever.
            </p>

            <div className="flex flex-wrap gap-3 justify-center animate-slide-up-delay-2">
              <Link
                href="/explore"
                className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium shadow-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
              >
                <i className="fas fa-compass mr-2" />Explore Memorials
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-lg font-medium shadow-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-8 bg-gradient-section-1">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-fade-in-delay">
              {[
                { value: "1000+", label: "Memorials" },
                { value: "5000+", label: "Memories Shared" },
                { value: "100%", label: "Free Forever" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-section-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-primary">How It Works</h2>
            <p className="text-text-muted mt-2">Creating meaningful tributes in simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "fa-user-plus", title: "Sign Up", desc: "Create your free account and verify your email to get started" },
              { icon: "fa-heart", title: "Create Memorial", desc: "Preserve memories of your loved one with photos, stories, and biographical information" },
              { icon: "fa-share-alt", title: "Share & Remember", desc: "Invite others to share memories and contribute to their legacy" },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="feature-icon relative mb-4">
                  <i className={`fas ${step.icon} text-4xl text-primary`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Memorials */}
      {featuredMemorials.length > 0 && (
        <section className="py-16 bg-gradient-section-3">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-primary">Featured Memorials</h2>
              <p className="text-text-muted mt-2">Preserving memories of our loved ones</p>
            </div>

            <div className="grid gap-8">
              {featuredMemorials.map((memorial) => (
                <div key={memorial.slug} className="flex justify-center">
                  <div className="bg-surface rounded-lg shadow-lg overflow-hidden w-full max-w-3xl transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                        {memorial.cover_image ? (
                          <img src={memorial.cover_image} alt={`Portrait of ${memorial.name}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center min-h-[250px] bg-gradient-to-br from-primary-lighter to-primary-light/30">
                            <i className="fas fa-user text-5xl text-primary opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="md:w-3/5 p-6 flex flex-col">
                        <h3 className="text-xl font-bold text-primary mb-2">{memorial.name}</h3>
                        {memorial.dob && memorial.dod && (
                          <p className="text-sm text-text-muted mb-3">
                            <i className="fas fa-calendar-alt mr-1" />
                            {new Date(memorial.dob).getFullYear()} - {new Date(memorial.dod).getFullYear()}
                          </p>
                        )}
                        <p className="text-text-muted mb-4 flex-1">{memorial.bio}</p>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-success text-white text-sm font-medium">
                              <i className="fas fa-heart mr-1" />{memorial.donations_count}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary text-white text-sm font-medium">
                              <i className="fas fa-tree mr-1" />{memorial.trees_planted_count}
                            </span>
                          </div>
                          <Link
                            href={`/m/${memorial.slug}`}
                            className="inline-flex items-center px-4 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            View Memorial <i className="fas fa-arrow-right ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
