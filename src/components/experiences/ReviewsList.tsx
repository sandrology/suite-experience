
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Review } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ReviewsListProps {
  reviews: Review[];
  experienceId: string;
  onReviewAdded: (newReview: Review) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, experienceId, onReviewAdded }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      toast({
        title: t('validationError'),
        description: t('pleaseCompleteAllFields'),
        variant: 'destructive',
      });
      return;
    }
    
    const newReview: Review = {
      id: uuidv4(),
      name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    
    onReviewAdded(newReview);
    
    // Reset form
    setName('');
    setRating(5);
    setComment('');
    
    toast({
      title: t('reviewAdded'),
      description: t('thankYouForYourReview'),
    });
  };
  
  return (
    <div className="space-y-8 mt-12 border-t pt-8">
      <h3 className="heading-sm">{t('reviews')} ({reviews.length})</h3>
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t('noReviewsYet')}</p>
      )}
      
      {/* Add Review Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">{t('leaveAReview')}</h4>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('yourName')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              {t('rating')}
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none mr-1"
                >
                  <Star 
                    className={`w-6 h-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              {t('yourComment')}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {t('submitReview')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsList;
