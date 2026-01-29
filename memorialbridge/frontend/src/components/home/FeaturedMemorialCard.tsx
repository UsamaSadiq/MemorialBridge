/**
 * Featured Memorial Card
 * Card for homepage featured section and memorials list; same look everywhere.
 * Accepts list API shape (full_name, story, images) or home shape (name, biography).
 */

import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/HomePage.module.css';

const truncate = (text: string | undefined, maxLength: number) => {
  if (!text || text.length <= maxLength) return text ?? '';
  return text.slice(0, maxLength).trim() + '...';
};

/** Resolve image URL so relative paths (e.g. uploads/xxx) load from API origin. */
function toImageSrc(url: string | undefined): string {
  if (!url) return '';
  const path = url.replace(/\\/g, '/').replace(/^\/+/, '');
  if (path.startsWith('http://') || path.startsWith('https://')) return url;
  const base =
    (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(
      /\/api\/v1\/?$/,
      ''
    ) || 'http://localhost:8000';
  return path ? `${base}/${path}` : '';
}

export interface FeaturedMemorialCardMemorial {
  id: string;
  name?: string;
  full_name?: string;
  birth_date?: string;
  death_date?: string;
  biography?: string;
  story?: string;
  images?: Array<{ url?: string; image_url?: string }>;
  status?: 'pending' | 'approved' | 'rejected';
  user_id?: string;
}

export interface FeaturedMemorialCardProps {
  memorial: FeaturedMemorialCardMemorial;
  variant?: 'featured' | 'list';
  currentUserId?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const FeaturedMemorialCard = ({
  memorial,
  variant = 'featured',
  currentUserId,
  onView,
  onEdit,
}: FeaturedMemorialCardProps) => {
  const navigate = useNavigate();
  const raw = memorial as unknown as Record<string, unknown>;
  const displayName =
    memorial.full_name ??
    memorial.name ??
    (typeof raw?.fullName === 'string' ? raw.fullName : null) ??
    'Untitled memorial';
  const storyText = memorial.story ?? memorial.biography;
  const firstImageUrl = memorial.images?.[0]?.url ?? memorial.images?.[0]?.image_url;
  const imageSrc = toImageSrc(firstImageUrl);

  const cardContent = (
    <>
      <div className={styles.featuredCardImage}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className={styles.featuredCardImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.featuredCardPlaceholder} aria-hidden>🕯</div>
        )}
      </div>
      <div className={styles.featuredCardContent}>
        <h3 className={styles.featuredCardName}>{displayName}</h3>
        {(memorial.birth_date || memorial.death_date) && (
          <p className={styles.featuredCardDates}>
            {memorial.birth_date ?? '—'} — {memorial.death_date ?? '—'}
          </p>
        )}
        {storyText && (
          <p className={styles.featuredCardStory}>{truncate(storyText, 100)}</p>
        )}
      </div>
    </>
  );

  if (variant === 'list') {
    const canEdit = memorial.user_id && currentUserId && memorial.user_id === currentUserId;
    const handleCardClick = () => {
      onView?.(memorial.id) ?? navigate(`/memorials/${memorial.id}`);
    };
    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit?.(memorial.id);
    };
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        className={styles.featuredCard}
        style={{ cursor: 'pointer' }}
      >
        {cardContent}
        <div className={styles.featuredCardFooter}>
          {memorial.status && (
            <span
              className={
                memorial.status === 'approved'
                  ? styles.featuredCardStatusApproved
                  : memorial.status === 'rejected'
                    ? styles.featuredCardStatusRejected
                    : styles.featuredCardStatusPending
              }
            >
              {memorial.status === 'approved'
                ? 'Approved'
                : memorial.status === 'rejected'
                  ? 'Rejected'
                  : 'Pending approval'}
            </span>
          )}
          <div className={styles.featuredCardActions}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className={styles.featuredCardBtnView}
            >
              View Memorial
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                className={styles.featuredCardBtnEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/memorials/${memorial.id}`} className={styles.featuredCard}>
      {cardContent}
    </Link>
  );
};
