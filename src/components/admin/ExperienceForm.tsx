
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from './RichTextEditor';
import { Experience } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import ReviewsManagement from './ReviewsManagement';

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: (experience: Partial<Experience>) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ 
  experience, 
  onSubmit 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Experience>>({
    enabled: experience?.enabled ?? true,
    images: experience?.images ?? [],
    translations: {
      en: {
        title: experience?.translations?.en.title ?? '',
        description: experience?.translations?.en.description ?? '',
        content: experience?.translations?.en.content ?? '',
      },
      it: {
        title: experience?.translations?.it.title ?? '',
        description: experience?.translations?.it.description ?? '',
        content: experience?.translations?.it.content ?? '',
      }
    },
    price: experience?.price ?? 0,
    duration: experience?.duration ?? '',
    location: experience?.location ?? '',
    rating: experience?.rating ?? 5.0,
    maxPeople: experience?.maxPeople ?? 10,
    reviews: experience?.reviews ?? [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (
    lang: 'en' | 'it',
    field: 'title' | 'description' | 'content',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations?.[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = e.target.value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleReviewsChange = (updatedReviews) => {
    setFormData((prev) => ({ ...prev, reviews: updatedReviews }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.translations?.en.title || !formData.translations?.it.title) {
      toast({
        title: "Error",
        description: "Title is required in both languages",
        variant: "destructive"
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    console.log("Form data before submitting:", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="english">
        <TabsList className="mb-4">
          <TabsTrigger value="english">{t('englishTab')}</TabsTrigger>
          <TabsTrigger value="italian">{t('italianTab')}</TabsTrigger>
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
        </TabsList>

        {/* English Content */}
        <TabsContent value="english" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('title')} (English)
            </label>
            <input
              type="text"
              value={formData.translations?.en.title || ''}
              onChange={(e) => handleLanguageChange('en', 'title', e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('description')} (English)
            </label>
            <textarea
              value={formData.translations?.en.description || ''}
              onChange={(e) => handleLanguageChange('en', 'description', e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('content')} (English)
            </label>
            <RichTextEditor
              initialValue={formData.translations?.en.content || ''}
              onChange={(value) => handleLanguageChange('en', 'content', value)}
            />
          </div>
        </TabsContent>

        {/* Italian Content */}
        <TabsContent value="italian" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('title')} (Italiano)
            </label>
            <input
              type="text"
              value={formData.translations?.it.title || ''}
              onChange={(e) => handleLanguageChange('it', 'title', e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('description')} (Italiano)
            </label>
            <textarea
              value={formData.translations?.it.description || ''}
              onChange={(e) => handleLanguageChange('it', 'description', e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('content')} (Italiano)
            </label>
            <RichTextEditor
              initialValue={formData.translations?.it.content || ''}
              onChange={(value) => handleLanguageChange('it', 'content', value)}
            />
          </div>
        </TabsContent>

        {/* Details */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (€)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="e.g. 3 hours, 2 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max People
              </label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople || ''}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Enable Experience</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            {(formData.images || []).map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageUrlChange(e, index)}
                  className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-secondary text-white p-2 rounded-md hover:bg-secondary-light"
            >
              Add Image
            </button>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <ReviewsManagement 
            reviews={formData.reviews || []} 
            onReviewsChange={handleReviewsChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {experience ? t('save') : t('create')}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
