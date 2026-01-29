import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Memorial Detail Page
 * Display full memorial with story, images, and tribute wall
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
export const MemorialDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [memorial, setMemorial] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    useEffect(() => {
        fetchMemorial();
    }, [id]);
    const fetchMemorial = async () => {
        if (!id) {
            navigate('/memorials');
            return;
        }
        try {
            setLoading(true);
            const response = await apiClient.get(`/memorials/${id}`);
            setMemorial(response.data);
            try {
                const commentsResponse = await apiClient.get(`/memorials/${id}/comments`);
                const raw = commentsResponse.data?.items ?? [];
                setComments(raw.map((c) => ({
                    id: c.id,
                    text: c.content,
                    author_name: c.user_email,
                    created_at: c.created_at,
                    is_hidden: c.is_hidden,
                })));
            }
            catch (commentsErr) {
                console.error('Failed to load comments:', commentsErr);
                setComments([]);
            }
        }
        catch (error) {
            toast.error('Failed to load memorial');
            console.error(error);
            navigate('/memorials');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim())
            return;
        try {
            setSubmittingComment(true);
            await apiClient.post(`/memorials/${id}/comments`, {
                content: newComment.trim(),
            });
            setNewComment('');
            await fetchMemorial();
            toast.success('Comment added');
        }
        catch (error) {
            toast.error('Failed to add comment');
            console.error(error);
        }
        finally {
            setSubmittingComment(false);
        }
    };
    const handleHideComment = async (commentId) => {
        if (!id || !user?.is_admin)
            return;
        try {
            await apiClient.patch(`/memorials/${id}/comments/${commentId}/hide`);
            await fetchMemorial();
            toast.success('Comment hidden');
        }
        catch (error) {
            toast.error('Failed to hide comment');
            console.error(error);
        }
    };
    const handleEdit = () => {
        navigate(`/memorials/${id}/edit`);
    };
    const handleDelete = () => {
        navigate(`/memorials/${id}/delete`);
    };
    const handleApprove = async () => {
        if (!id || !user?.is_admin)
            return;
        try {
            await apiClient.post(`/admin/memorials/${id}/approve`);
            toast.success('Memorial approved. It is now available per the creator\'s privacy setting.');
            await fetchMemorial();
        }
        catch (error) {
            toast.error('Failed to approve memorial');
            console.error(error);
        }
    };
    const handleReject = async () => {
        if (!id || !user?.is_admin)
            return;
        try {
            await apiClient.post(`/admin/memorials/${id}/reject`);
            toast.success('Memorial rejected');
            await fetchMemorial();
        }
        catch (error) {
            toast.error('Failed to reject memorial');
            console.error(error);
        }
    };
    const handleSetFeatured = async (featured) => {
        if (!id || !user?.is_admin)
            return;
        try {
            await apiClient.patch(`/admin/memorials/${id}/featured`, { is_featured: featured });
            toast.success(featured ? 'Memorial featured on home page' : 'Memorial removed from featured');
            await fetchMemorial();
        }
        catch (error) {
            toast.error('Failed to update featured status');
            console.error(error);
        }
    };
    const canEditMemorial = () => {
        return user?.id === memorial?.user_id;
    };
    /** Normalize API response: backend may send name/bio or full_name/story */
    const displayName = memorial ? (memorial.full_name ?? memorial.name ?? '') : '';
    const displayStory = memorial ? (memorial.story ?? memorial.bio ?? '') : '';
    // Same origin as API client so browser can load uploaded images (e.g. /uploads/xxx)
    const imageBaseUrl = (() => {
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
        const origin = base.replace(/\/api\/v1\/?$/, '') || 'http://localhost:8000';
        return origin;
    })();
    const toImageSrc = (url) => {
        if (!url)
            return '';
        const path = url.replace(/\\/g, '/').replace(/^\/+/, '');
        if (path.startsWith('http://') || path.startsWith('https://'))
            return url;
        const base = imageBaseUrl.replace(/\/+$/, '');
        return path ? `${base}/${path}` : '';
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !id)
            return;
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);
            await apiClient.post(`/memorials/${id}/upload-image`, formData);
            toast.success('Image added');
            await fetchMemorial();
        }
        catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        }
        finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Loading memorial..." })] }) }));
    }
    if (!memorial) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-900 text-lg mb-4", children: "Memorial not found" }), _jsx("button", { onClick: () => navigate('/memorials'), className: "text-brand-blue-600 hover:text-brand-blue-700 font-medium", children: "\u2190 Back to Memorials" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex justify-between items-start md:items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-3", children: displayName }), _jsxs("p", { className: "text-gray-600 text-lg flex items-center gap-2", children: [_jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), memorial.birth_date, " - ", memorial.death_date] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 shrink-0", children: [canEditMemorial() && (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", onClick: handleEdit, className: "btn btn-primary flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }), "Edit"] }), _jsx("button", { type: "button", onClick: handleDelete, className: "px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors", children: "Delete" })] })), user?.is_admin && memorial?.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", onClick: handleApprove, className: "btn btn-success flex items-center gap-2", children: "\u2713 Mark as Approved" }), _jsx("button", { type: "button", onClick: handleReject, className: "px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors", children: "Reject" })] })), user?.is_admin && memorial?.status === 'approved' && (_jsx("button", { type: "button", onClick: () => handleSetFeatured(!memorial.is_featured), className: `flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${memorial.is_featured
                                                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                                : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'}`, title: memorial.is_featured ? 'Remove from home page featured' : 'Show on home page featured section', children: memorial.is_featured ? '★ Featured' : '☆ Feature for home' }))] })] }), _jsxs("div", { className: "flex flex-wrap gap-3 mt-6", children: [_jsx("span", { className: "inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg border border-gray-200", children: memorial.privacy === 'public' ? (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Public"] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }), "Link-only"] })) }), _jsx("span", { className: `inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border ${memorial.status === 'approved'
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : memorial.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                            : 'bg-red-100 text-red-800 border-red-200'}`, children: memorial.status.charAt(0).toUpperCase() + memorial.status.slice(1) })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [displayStory && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Their Story" }), _jsx("p", { className: "text-gray-700 whitespace-pre-wrap leading-relaxed", children: displayStory })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Photos" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [(memorial.images || []).map((img) => {
                                        const rawUrl = 'url' in img ? img.url : img.image_url;
                                        const src = toImageSrc(rawUrl);
                                        return (_jsx("div", { className: "w-40 h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-100", children: _jsx("img", { src: src, alt: "Memorial", className: "w-full h-full object-cover", onError: (e) => { e.target.style.display = 'none'; } }) }, img.id));
                                    }), canEditMemorial() && (memorial.images?.length ?? 0) < 2 && (_jsxs("label", { className: "w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-600", children: [_jsx("input", { type: "file", accept: "image/jpeg,image/png,image/webp", onChange: handleImageUpload, disabled: uploadingImage, className: "hidden" }), uploadingImage ? (_jsx("span", { className: "text-sm", children: "Uploading..." })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "w-8 h-8 mb-1 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), _jsx("span", { className: "text-sm", children: "Add photo" })] }))] }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 border border-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Tribute Wall" }), user && (_jsxs("form", { onSubmit: handleAddComment, className: "mb-8 pb-8 border-b border-gray-200", children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Share your tribute or memory" }), _jsx("textarea", { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Express your feelings, share a memory, or leave a message of support...", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500", rows: 4, disabled: submittingComment }), _jsxs("div", { className: "mt-4 flex justify-between items-center flex-wrap gap-2", children: [_jsx("p", { className: "text-xs text-gray-600 italic", children: "Your words of remembrance are a gift to those who are grieving" }), _jsx("button", { type: "submit", disabled: !newComment.trim() || submittingComment, className: "btn btn-success", children: submittingComment ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Posting..."] })) : (_jsxs(_Fragment, { children: ["Post Tribute", _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })] })) })] })] })), comments.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600", children: "No tributes yet. Be the first to share." }), !user && (_jsx("button", { type: "button", onClick: () => navigate('/login'), className: "mt-4 text-blue-600 hover:text-blue-700 font-medium", children: "Sign in to leave a tribute \u2192" }))] })) : (_jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsxs("div", { className: "border-l-4 border-gray-300 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100/80 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-gray-700 font-semibold text-sm", children: comment.author_name.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: comment.author_name }), _jsx("p", { className: "text-xs text-gray-600", children: new Date(comment.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    }) })] })] }), user?.is_admin && (_jsx("button", { type: "button", onClick: () => handleHideComment(comment.id), className: "text-sm text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-red-200", title: "Hide this tribute (admin)", children: "Hide" }))] }), _jsx("p", { className: "text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed pl-10", children: comment.text })] }, comment.id))) }))] })] })] }));
};
export default MemorialDetailPage;
