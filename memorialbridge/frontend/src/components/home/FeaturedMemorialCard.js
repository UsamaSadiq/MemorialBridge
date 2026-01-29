import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Featured Memorial Card
 * Card for homepage featured section and memorials list; same look everywhere.
 * Accepts list API shape (full_name, story, images) or home shape (name, biography).
 */
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/HomePage.module.css';
const truncate = (text, maxLength) => {
    if (!text || text.length <= maxLength)
        return text ?? '';
    return text.slice(0, maxLength).trim() + '...';
};
/** Resolve image URL so relative paths (e.g. uploads/xxx) load from API origin. */
function toImageSrc(url) {
    if (!url)
        return '';
    const path = url.replace(/\\/g, '/').replace(/^\/+/, '');
    if (path.startsWith('http://') || path.startsWith('https://'))
        return url;
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '') || 'http://localhost:8000';
    return path ? `${base}/${path}` : '';
}
export const FeaturedMemorialCard = ({ memorial, variant = 'featured', currentUserId, onView, onEdit, }) => {
    const navigate = useNavigate();
    const raw = memorial;
    const displayName = memorial.full_name ??
        memorial.name ??
        (typeof raw?.fullName === 'string' ? raw.fullName : null) ??
        'Untitled memorial';
    const storyText = memorial.story ?? memorial.biography;
    const firstImageUrl = memorial.images?.[0]?.url ?? memorial.images?.[0]?.image_url;
    const imageSrc = toImageSrc(firstImageUrl);
    const cardContent = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.featuredCardImage, children: imageSrc ? (_jsx("img", { src: imageSrc, alt: "", className: styles.featuredCardImg, loading: "lazy" })) : (_jsx("div", { className: styles.featuredCardPlaceholder, "aria-hidden": true, children: "\uD83D\uDD6F" })) }), _jsxs("div", { className: styles.featuredCardContent, children: [_jsx("h3", { className: styles.featuredCardName, children: displayName }), (memorial.birth_date || memorial.death_date) && (_jsxs("p", { className: styles.featuredCardDates, children: [memorial.birth_date ?? '—', " \u2014 ", memorial.death_date ?? '—'] })), storyText && (_jsx("p", { className: styles.featuredCardStory, children: truncate(storyText, 100) }))] })] }));
    if (variant === 'list') {
        const canEdit = memorial.user_id && currentUserId && memorial.user_id === currentUserId;
        const handleCardClick = () => {
            onView?.(memorial.id) ?? navigate(`/memorials/${memorial.id}`);
        };
        const handleEditClick = (e) => {
            e.stopPropagation();
            onEdit?.(memorial.id);
        };
        return (_jsxs("div", { role: "button", tabIndex: 0, onClick: handleCardClick, onKeyDown: (e) => e.key === 'Enter' && handleCardClick(), className: styles.featuredCard, style: { cursor: 'pointer' }, children: [cardContent, _jsxs("div", { className: styles.featuredCardFooter, children: [memorial.status && (_jsx("span", { className: memorial.status === 'approved'
                                ? styles.featuredCardStatusApproved
                                : memorial.status === 'rejected'
                                    ? styles.featuredCardStatusRejected
                                    : styles.featuredCardStatusPending, children: memorial.status === 'approved'
                                ? 'Approved'
                                : memorial.status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending approval' })), _jsxs("div", { className: styles.featuredCardActions, children: [_jsx("button", { type: "button", onClick: (e) => {
                                        e.stopPropagation();
                                        handleCardClick();
                                    }, className: styles.featuredCardBtnView, children: "View Memorial" }), canEdit && (_jsx("button", { type: "button", onClick: handleEditClick, className: styles.featuredCardBtnEdit, children: "Edit" }))] })] })] }));
    }
    return (_jsx(Link, { to: `/memorials/${memorial.id}`, className: styles.featuredCard, children: cardContent }));
};
