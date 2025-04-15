
import { Review } from '../types/experience';

// Aggiunge una recensione a un'esperienza
export const addReview = (experienceId: string, review: Review): boolean => {
  try {
    // Recupera le recensioni esistenti dal localStorage
    const reviewsData = localStorage.getItem(`reviews_${experienceId}`);
    let reviews: Review[] = [];
    
    if (reviewsData) {
      reviews = JSON.parse(reviewsData);
    }
    
    // Aggiungi la nuova recensione
    reviews.push(review);
    
    // Salva nel localStorage
    localStorage.setItem(`reviews_${experienceId}`, JSON.stringify(reviews));
    
    return true;
  } catch (error) {
    console.error('Error adding review:', error);
    return false;
  }
};

// Ottiene le recensioni per un'esperienza
export const getReviews = (experienceId: string): Review[] => {
  try {
    const reviewsData = localStorage.getItem(`reviews_${experienceId}`);
    
    if (reviewsData) {
      return JSON.parse(reviewsData);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

// Elimina una recensione
export const deleteReview = (experienceId: string, reviewId: string): boolean => {
  try {
    const reviewsData = localStorage.getItem(`reviews_${experienceId}`);
    
    if (!reviewsData) {
      return false;
    }
    
    let reviews: Review[] = JSON.parse(reviewsData);
    
    // Filtra la recensione da eliminare
    reviews = reviews.filter(review => review.id !== reviewId);
    
    // Salva nel localStorage
    localStorage.setItem(`reviews_${experienceId}`, JSON.stringify(reviews));
    
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};

// Calcola la valutazione media
export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};
