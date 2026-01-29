import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Create Memorial Page
 * Form to create a new memorial
 */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
const createMemorialSchema = z.object({
    full_name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(255, 'Name must be less than 255 characters'),
    birth_date: z.string().refine((date) => date !== '', 'Birth date is required'),
    death_date: z.string().refine((date) => date !== '', 'Death date is required'),
    story: z.string().max(5000, 'Story must be less than 5000 characters').optional().or(z.literal('')),
    privacy: z.enum(['public', 'link-only']),
    charity_id: z.string().optional(),
});
export const CreateMemorialPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [submitting, setSubmitting] = useState(false);
    const [charities, setCharities] = useState([]);
    const [loadingCharities, setLoadingCharities] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const selectedCharityId = searchParams.get('charity');
    const MAX_IMAGES = 2;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const valid = files.filter((f) => allowedTypes.includes(f.type));
        setSelectedImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
        e.target.value = '';
    };
    const removeImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };
    useEffect(() => {
        fetchCharities();
    }, []);
    const fetchCharities = async () => {
        try {
            setLoadingCharities(true);
            const response = await apiClient.get('/charities?limit=100');
            setCharities(response.data.items || response.data);
        }
        catch (error) {
            console.error('Failed to fetch charities:', error);
            setCharities([]);
        }
        finally {
            setLoadingCharities(false);
        }
    };
    const { register, handleSubmit, formState: { errors, isValid }, watch, } = useForm({
        resolver: zodResolver(createMemorialSchema),
        mode: 'onChange',
        defaultValues: {
            charity_id: selectedCharityId || undefined,
        },
    });
    const birthDate = watch('birth_date');
    const deathDate = watch('death_date');
    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            const response = await apiClient.post('/memorials', {
                full_name: data.full_name,
                birth_date: data.birth_date,
                death_date: data.death_date,
                story: data.story || null,
                privacy: data.privacy,
                charity_id: data.charity_id || null,
            });
            const memorialId = response.data?.id;
            if (!memorialId) {
                toast.error('Memorial created but could not load it. Please go to Memorials to find it.');
                setSubmitting(false);
                return;
            }
            const toUpload = selectedImages.slice(0, MAX_IMAGES);
            let uploadFailures = 0;
            for (let i = 0; i < toUpload.length; i++) {
                try {
                    const formData = new FormData();
                    formData.append('file', toUpload[i]);
                    await apiClient.post(`/memorials/${memorialId}/upload-image`, formData);
                }
                catch (err) {
                    console.error('Image upload failed:', err);
                    uploadFailures += 1;
                    toast.error(`Image ${i + 1} upload failed`);
                }
            }
            if (toUpload.length === 0) {
                toast.success('Memorial created successfully');
            }
            else if (uploadFailures === 0) {
                toast.success('Memorial created successfully with image(s)');
            }
            else {
                toast.success('Memorial created; some images could not be uploaded.');
            }
            navigate(`/memorials/${memorialId}`);
        }
        catch (error) {
            toast.error('Failed to create memorial');
            console.error(error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Create Memorial" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Honor and celebrate a cherished life" })] }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx("div", { className: "bg-white rounded-lg shadow-sm p-8", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "full_name", className: "block text-sm font-medium text-gray-900", children: "Full Name *" }), _jsx("input", { id: "full_name", ...register('full_name'), type: "text", placeholder: "Full name of the person being memorialized", className: "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500" }), errors.full_name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.full_name.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birth_date", className: "block text-sm font-medium text-gray-900", children: "Birth Date *" }), _jsx("input", { id: "birth_date", ...register('birth_date'), type: "date", className: "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" }), errors.birth_date && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.birth_date.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "death_date", className: "block text-sm font-medium text-gray-900", children: "Death Date *" }), _jsx("input", { id: "death_date", ...register('death_date'), type: "date", className: "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" }), errors.death_date && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.death_date.message })), birthDate && deathDate && new Date(deathDate) <= new Date(birthDate) && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: "Death date must be after birth date" }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "story", className: "block text-sm font-medium text-gray-900", children: "Their Story" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Share memories, achievements, and what made them special" }), _jsx("textarea", { id: "story", ...register('story'), placeholder: "Write a tribute or share memories...", className: "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-40 text-gray-900 placeholder:text-gray-500" }), errors.story && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.story.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900", children: "Privacy Setting *" }), _jsxs("div", { className: "mt-3 space-y-3", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { ...register('privacy'), type: "radio", value: "public", defaultChecked: true, className: "h-4 w-4 text-blue-600" }), _jsxs("span", { className: "ml-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: "Public" }), _jsx("p", { className: "text-xs text-gray-600", children: "Anyone can find and view this memorial" })] })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { ...register('privacy'), type: "radio", value: "link-only", className: "h-4 w-4 text-blue-600" }), _jsxs("span", { className: "ml-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: "Link Only" }), _jsx("p", { className: "text-xs text-gray-600", children: "Only people with the link can view" })] })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "charity_id", className: "block text-sm font-medium text-gray-900", children: "Support a Charity (Optional)" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Link this memorial to a charitable cause" }), _jsxs("select", { id: "charity_id", ...register('charity_id'), disabled: loadingCharities, className: "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900", children: [_jsx("option", { value: "", children: "Select a charity (optional)" }), charities.map((charity) => (_jsx("option", { value: charity.id, children: charity.name }, charity.id)))] }), loadingCharities && _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Loading charities..." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "memorial_image", className: "block text-sm font-medium text-gray-900", children: "Memorial Images (optional)" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Add up to 2 images (JPEG, PNG, or WebP)" }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-3 items-center", children: [_jsxs("label", { className: "cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm", children: [_jsx("input", { id: "memorial_image", type: "file", accept: "image/jpeg,image/png,image/webp", multiple: true, onChange: handleImageSelect, disabled: submitting || selectedImages.length >= MAX_IMAGES, className: "sr-only" }), _jsxs("span", { children: ["Choose file", selectedImages.length < MAX_IMAGES ? '(s)' : ''] })] }), selectedImages.map((file, index) => (_jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-800", children: [file.name, _jsx("button", { type: "button", onClick: () => removeImage(index), disabled: submitting, className: "text-gray-500 hover:text-red-600", "aria-label": "Remove image", children: "\u00D7" })] }, `${file.name}-${index}`))), selectedImages.length >= MAX_IMAGES && (_jsx("span", { className: "text-sm text-gray-500", children: "Max 2 images" }))] })] }), _jsxs("div", { className: "flex gap-4 pt-6 border-t border-gray-200", children: [_jsx("button", { type: "button", onClick: () => navigate('/memorials'), className: "btn btn-secondary flex-1", children: "Cancel" }), _jsx("button", { type: "submit", disabled: !isValid || submitting, className: "btn btn-primary flex-1", children: submitting ? 'Creating...' : 'Create Memorial' })] })] }) }) })] }));
};
export default CreateMemorialPage;
