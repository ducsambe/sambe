import React, { useState } from 'react';
import { Star, User, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReviewsSectionProps {
  propertyId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ propertyId }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const mockReviews = [
    {
      id: '1',
      user_name: 'Marie Dupont',
      rating: 5,
      comment: 'Excellent terrain avec une vue magnifique. Le processus d\'achat s\'est très bien déroulé.',
      created_at: '2024-01-10T10:00:00Z',
      helpful_count: 12
    },
    {
      id: '2',
      user_name: 'Jean Martin',
      rating: 4,
      comment: 'Très bon emplacement, proche de toutes les commodités. Je recommande vivement.',
      created_at: '2024-01-05T15:30:00Z',
      helpful_count: 8
    }
  ];

  const handleSubmitReview = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour laisser un avis');
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast.error('Votre commentaire doit contenir au moins 10 caractères');
      return;
    }

    // In real app, this would submit to backend
    toast.success('Votre avis a été soumis et sera publié après modération');
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Avis clients</h3>
          <div className="flex items-center mt-2">
            {renderStars(Math.round(averageRating))}
            <span className="ml-2 text-sm text-gray-600">
              {averageRating.toFixed(1)} sur 5 ({mockReviews.length} avis)
            </span>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold mb-4">Votre avis</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Partagez votre expérience..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Publier l'avis
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">{review.user_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            
            <p className="text-gray-700 mb-4">{review.comment}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <button className="flex items-center hover:text-emerald-600 transition-colors mr-4">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Utile ({review.helpful_count})
              </button>
              <button className="flex items-center hover:text-blue-600 transition-colors">
                <MessageCircle className="h-4 w-4 mr-1" />
                Répondre
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;