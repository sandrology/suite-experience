
import React, { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Review } from '../../types/experience';

interface ReviewsManagementProps {
  reviews: Review[];
  onReviewsChange: (reviews: Review[]) => void;
}

const ReviewsManagement: React.FC<ReviewsManagementProps> = ({
  reviews = [],
  onReviewsChange
}) => {
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: '',
    rating: 5,
    comment: '',
  });

  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment) return;

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name!,
      rating: newReview.rating || 5,
      comment: newReview.comment!,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [...reviews, review];
    onReviewsChange(updatedReviews);
    
    // Reset form
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
    });
  };

  const handleDeleteReview = (id: string) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    onReviewsChange(updatedReviews);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Reviews Management</h3>
      
      {/* Current Reviews */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Current Reviews ({reviews.length})</h4>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.name}</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? 'text-accent fill-accent' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add New Review */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium mb-3">Add New Review</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newReview.name || ''}
              onChange={(e) => setNewReview({...newReview, name: e.target.value})}
              className="w-full border rounded-md p-2"
              placeholder="Reviewer's name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({...newReview, rating: star})}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      star <= (newReview.rating || 5) ? 'text-accent fill-accent' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={newReview.comment || ''}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full border rounded-md p-2 min-h-[100px]"
              placeholder="Review comment"
            ></textarea>
          </div>
          
          <button
            type="button"
            onClick={handleAddReview}
            className="btn-primary"
            disabled={!newReview.name || !newReview.comment}
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;
