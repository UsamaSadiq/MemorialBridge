/**
 * Edit Memorial Page
 * Form to edit an existing memorial
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';

const editMemorialSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  birth_date: z.string().refine((date) => date !== '', 'Birth date is required'),
  death_date: z.string().refine((date) => date !== '', 'Death date is required'),
  story: z.string().max(5000, 'Story must be less than 5000 characters').optional().or(z.literal('')),
  privacy: z.enum(['public', 'link-only']),
});

type EditMemorialFormData = z.infer<typeof editMemorialSchema>;

interface Memorial extends EditMemorialFormData {
  id: string;
  user_id: string;
}

export const EditMemorialPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<EditMemorialFormData>({
    resolver: zodResolver(editMemorialSchema),
    mode: 'onChange',
  });

  const birthDate = watch('birth_date');
  const deathDate = watch('death_date');

  useEffect(() => {
    fetchMemorial();
  }, [id]);

  const fetchMemorial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Memorial>(`/memorials/${id}`);

      // Check authorization
      if (response.data.user_id !== user?.id) {
        toast.error('You do not have permission to edit this memorial');
        navigate(`/memorials/${id}`);
        return;
      }

      reset({
        full_name: response.data.full_name,
        birth_date: response.data.birth_date,
        death_date: response.data.death_date,
        story: response.data.story || '',
        privacy: response.data.privacy,
      });
    } catch (error) {
      toast.error('Failed to load memorial');
      console.error(error);
      navigate('/memorials');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EditMemorialFormData) => {
    try {
      setSubmitting(true);

      await apiClient.put(`/memorials/${id}`, {
        full_name: data.full_name,
        birth_date: data.birth_date,
        death_date: data.death_date,
        story: data.story || null,
        privacy: data.privacy,
      });

      toast.success('Memorial updated successfully');
      navigate(`/memorials/${id}`);
    } catch (error) {
      toast.error('Failed to update memorial');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Memorial</h1>
          <p className="mt-2 text-gray-600">Update memorial information</p>
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
                {...register('full_name')}
                type="text"
                placeholder="Full name of the person being memorialized"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {...register('birth_date')}
                type="date"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {...register('death_date')}
                type="date"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <p className="text-xs text-gray-600 mt-1">Update memories and achievements</p>
              <textarea
                {...register('story')}
                placeholder="Write a tribute or share memories..."
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-40"
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

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/memorials/${id}`)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || submitting}
                className="btn btn-primary flex-1"
              >
                {submitting ? 'Updating...' : 'Update Memorial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMemorialPage;
