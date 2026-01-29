/**
 * Home Page
 * Layout: Hero → How It Works (timeline) → Features (6) → Featured Memorials (horizontal scroll) → Stats
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { memorialAPI } from '../api/memorial';
import type { Memorial } from '../types';
import { FeaturedMemorialCard } from '../components/home/FeaturedMemorialCard';
import styles from '../styles/HomePage.module.css';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredMemorials, setFeaturedMemorials] = useState<Memorial[]>([]);
  const [loadingMemorials, setLoadingMemorials] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Featured section: only admin-marked featured memorials (public, no auth required)
        const data = await memorialAPI.listMemorials(1, 9, { featured: true });
        const list = 'items' in data ? data.items : (data as { memorials?: Memorial[] }).memorials ?? [];
        setFeaturedMemorials(Array.isArray(list) ? list : []);
      } catch {
        setFeaturedMemorials([]);
      } finally {
        setLoadingMemorials(false);
      }
    };
    load();
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBgImage} aria-hidden />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroTagline}>Preserve Memories. Inspire Legacy.</p>
          <h1 className={styles.heroTitle}>Honor the lives of those we love</h1>
          <p className={styles.heroSubtitle}>
            Create lasting tributes and connect cherished memories to meaningful causes.
            A respectful space to celebrate lives and carry their legacy forward.
          </p>
          <div className={styles.heroCtas}>
            {isAuthenticated ? (
              <>
                <Link to="/memorials/create" className={styles.btnHeroPrimary}>
                  <span aria-hidden>♥</span> Create a Memorial
                </Link>
                <Link to="/memorials" className={styles.btnHeroSecondary}>
                  Explore Public Memorials
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className={styles.btnHeroPrimary}>
                  <span aria-hidden>♥</span> Create a Memorial
                </Link>
                <a href="#featured-memorials" className={styles.btnHeroSecondary}>
                  Explore Public Memorials
                </a>
              </>
            )}
          </div>
          <p className={styles.heroTrust}>
            <span className={styles.heroTrustIcon} aria-hidden>✓</span>
            No ads. No clutter. Just memories that matter.
          </p>
        </div>
      </section>

      {/* How To – horizontal timeline: Create, Share, Connect, Remember */}
      <section className={styles.timelineSection} aria-labelledby="howto-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="howto-heading" className={styles.sectionTitle}>
              How It Works
            </h2>
            <p className={styles.sectionSubtitle}>
              Creating a memorial is simple, respectful, and free.
            </p>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineTrack} aria-hidden />
            <div className={styles.timelinePoints}>
              <div className={styles.timelinePoint}>
                <div className={styles.timelineMarker}>
                  <span className={styles.timelineIcon} aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </span>
                </div>
                <div className={styles.timelineContent}>
                  <h3>Create</h3>
                  <p>Start a beautiful memorial with photos, stories, and memories.</p>
                </div>
              </div>
              <div className={styles.timelinePoint}>
                <div className={styles.timelineMarker}>
                  <span className={styles.timelineIcon} aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </span>
                </div>
                <div className={styles.timelineContent}>
                  <h3>Share</h3>
                  <p>Invite family and friends to contribute and share their own memories.</p>
                </div>
              </div>
              <div className={styles.timelinePoint}>
                <div className={styles.timelineMarker}>
                  <span className={styles.timelineIcon} aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </span>
                </div>
                <div className={styles.timelineContent}>
                  <h3>Connect</h3>
                  <p>Link to meaningful causes and charities that honor their legacy.</p>
                </div>
              </div>
              <div className={styles.timelinePoint}>
                <div className={styles.timelineMarker}>
                  <span className={styles.timelineIcon} aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </span>
                </div>
                <div className={styles.timelineContent}>
                  <h3>Remember</h3>
                  <p>Keep their memory alive forever with a lasting, meaningful tribute.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features – six blocks */}
      <section className={styles.featuresSection} aria-labelledby="features-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="features-heading" className={styles.sectionTitle}>
              Why Choose Memorial Bridge?
            </h2>
            <p className={styles.sectionSubtitle}>
              A thoughtful platform designed to honor memories with elegance and meaning.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconBlue}`} aria-hidden>📷</div>
              <h3>Beautiful Tributes</h3>
              <p>Create meaningful memorials with photos, stories, and memories that celebrate a life well-lived.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconGreen}`} aria-hidden>♥</div>
              <h3>Community Support</h3>
              <p>Share memories and support with loved ones in a respectful, private, and safe environment.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconRose}`} aria-hidden>💬</div>
              <h3>Lasting Impact</h3>
              <p>Connect memorials to causes and charities that would have mattered to the person you remember.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconLavender}`} aria-hidden>🔒</div>
              <h3>Privacy First</h3>
              <p>Keep memorials private for family or share publicly. You control who can view and contribute.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconBlue}`} aria-hidden>📱</div>
              <h3>Easy to Use</h3>
              <p>Simple, intuitive design that works seamlessly across all your devices.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.featureIconGreen}`} aria-hidden>∞</div>
              <h3>Forever Accessible</h3>
              <p>Memorials that last. Access memories anytime from anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Memorials – horizontal scroll (3 visible) */}
      <section className={styles.featuredSection} id="featured-memorials" aria-labelledby="featured-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              Featured Memorials
            </h2>
            <p className={styles.sectionSubtitle}>
              See how others are honoring their loved ones around the world.
            </p>
          </div>
          {loadingMemorials ? (
            <div className={styles.featuredLoading}>
              <div className={styles.spinner} aria-hidden />
              <p>Loading memorials…</p>
            </div>
          ) : featuredMemorials.length === 0 ? (
            <div className={styles.featuredEmpty}>
              <span className={styles.featuredEmptyIcon} aria-hidden>🕯</span>
              <h3>No memorials yet</h3>
              <p>Be the first to create a memorial for someone special.</p>
              <p className={styles.featuredEmptyMessage}>It&apos;s okay to take your time.</p>
              <Link
                to={isAuthenticated ? '/memorials/create' : '/register'}
                className={styles.btnHeroPrimary}
              >
                Create the First Memorial
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.featuredScrollWrap}>
                <div className={styles.featuredScroll} role="list">
                  {featuredMemorials.map((m) => (
                    <div key={m.id} className={styles.featuredScrollItem} role="listitem">
                      <FeaturedMemorialCard memorial={m} />
                    </div>
                  ))}
                </div>
              </div>
              {featuredMemorials.length > 0 && (
                <div className={styles.sectionCta}>
                  <Link to="/memorials" className={styles.btnViewAll}>
                    View All Memorials <span aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats – commented out for now
      <section className={styles.metaStrip} aria-label="Project at a glance">
        <div className={styles.container}>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>50K+</span>
              <span className={styles.metaLabel}>Memorials Created</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>$2M+</span>
              <span className={styles.metaLabel}>Donations to Causes</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>180+</span>
              <span className={styles.metaLabel}>Countries</span>
            </div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
};
