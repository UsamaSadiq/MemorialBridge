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

interface Charity {
  id: string;
  name: string;
  description: string;
}

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

type CreateMemorialFormData = z.infer<typeof createMemorialSchema>;

export const CreateMemorialPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loadingCharities, setLoadingCharities] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const selectedCharityId = searchParams.get('charity');

  const MAX_IMAGES = 2;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => allowedTypes.includes(f.type));
    setSelectedImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      setLoadingCharities(true);
      const response = await apiClient.get<{ items: Charity[] }>('/charities?limit=100');
      setCharities(response.data.items || response.data);
    } catch (error) {
      console.error('Failed to fetch charities:', error);
      setCharities([]);
    } finally {
      setLoadingCharities(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateMemorialFormData>({
    resolver: zodResolver(createMemorialSchema),
    mode: 'onChange',
    defaultValues: {
      charity_id: selectedCharityId || undefined,
    },
  });

  const birthDate = watch('birth_date');
  const deathDate = watch('death_date');

  const onSubmit = async (data: CreateMemorialFormData) => {
    try {
      setSubmitting(true);

      const response = await apiClient.post<{ id: string }>('/memorials', {
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
        } catch (err) {
          console.error('Image upload failed:', err);
          uploadFailures += 1;
          toast.error(`Image ${i + 1} upload failed`);
        }
      }
      if (toUpload.length === 0) {
        toast.success('Memorial created successfully');
      } else if (uploadFailures === 0) {
        toast.success('Memorial created successfully with image(s)');
      } else {
        toast.success('Memorial created; some images could not be uploaded.');
      }
      navigate(`/memorials/${memorialId}`);
    } catch (error) {
      toast.error('Failed to create memorial');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Memorial</h1>
          <p className="mt-2 text-gray-600">Honor and celebrate a cherished life</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-900">
                Full Name *
              </label>
              <input
                id="full_name"
                {...register('full_name')}
                type="text"
                placeholder="Full name of the person being memorialized"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-900">
                Birth Date *
              </label>
              <input
                id="birth_date"
                {...register('birth_date')}
                type="date"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              {errors.birth_date && (
                <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
              )}
            </div>

            {/* Death Date */}
            <div>
              <label htmlFor="death_date" className="block text-sm font-medium text-gray-900">
                Death Date *
              </label>
              <input
                id="death_date"
                {...register('death_date')}
                type="date"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              {errors.death_date && (
                <p className="mt-1 text-sm text-red-600">{errors.death_date.message}</p>
              )}
              {birthDate && deathDate && new Date(deathDate) <= new Date(birthDate) && (
                <p className="mt-1 text-sm text-red-600">Death date must be after birth date</p>
              )}
            </div>

            {/* Story */}
            <div>
              <label htmlFor="story" className="block text-sm font-medium text-gray-900">
                Their Story
              </label>
              <p className="text-xs text-gray-600 mt-1">Share memories, achievements, and what made them special</p>
              <textarea
                id="story"
                {...register('story')}
                placeholder="Write a tribute or share memories..."
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-40 text-gray-900 placeholder:text-gray-500"
              />
              {errors.story && <p className="mt-1 text-sm text-red-600">{errors.story.message}</p>}
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Privacy Setting *</label>
              <div className="mt-3 space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('privacy')}
                    type="radio"
                    value="public"
                    defaultChecked
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-900">Public</span>
                    <p className="text-xs text-gray-600">Anyone can find and view this memorial</p>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('privacy')}
                    type="radio"
                    value="link-only"
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-900">Link Only</span>
                    <p className="text-xs text-gray-600">Only people with the link can view</p>
                  </span>
                </label>
              </div>
            </div>

            {/* Charity Selection */}
            <div>
              <label htmlFor="charity_id" className="block text-sm font-medium text-gray-900">
                Support a Charity (Optional)
              </label>
              <p className="text-xs text-gray-600 mt-1">Link this memorial to a charitable cause</p>
              <select
                id="charity_id"
                {...register('charity_id')}
                disabled={loadingCharities}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select a charity (optional)</option>
                {charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>
              {loadingCharities && <p className="mt-1 text-sm text-gray-600">Loading charities...</p>}
            </div>
            {/* Memorial Image(s) - optional, up to 2 */}
            <div>
              <label htmlFor="memorial_image" className="block text-sm font-medium text-gray-900">
                Memorial Images (optional)
              </label>
              <p className="text-xs text-gray-600 mt-1">Add up to 2 images (JPEG, PNG, or WebP)</p>
              <div className="mt-2 flex flex-wrap gap-3 items-center">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                  <input
                    id="memorial_image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageSelect}
                    disabled={submitting || selectedImages.length >= MAX_IMAGES}
                    className="sr-only"
                  />
                  <span>Choose file{selectedImages.length < MAX_IMAGES ? '(s)' : ''}</span>
                </label>
                {selectedImages.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-800"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={submitting}
                      className="text-gray-500 hover:text-red-600"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedImages.length >= MAX_IMAGES && (
                  <span className="text-sm text-gray-500">Max 2 images</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/memorials')}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || submitting}
                className="btn btn-primary flex-1"
              >
                {submitting ? 'Creating...' : 'Create Memorial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMemorialPage;
