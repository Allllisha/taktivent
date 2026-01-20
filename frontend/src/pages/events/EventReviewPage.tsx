import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { eventsApi, reviewsApi } from '@/api';
import { useToastStore } from '@/stores';
import type { ReviewFormData, Sentiment } from '@/types';

export function EventReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 3,
    sentiment: 'neutral',
    comment: '',
    responses: {},
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(Number(id)),
  });

  const submitMutation = useMutation({
    mutationFn: (data: ReviewFormData) => reviewsApi.createEventReview(Number(id), data),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: 'Thank you for your feedback!',
        duration: 5000,
      });
      navigate(`/events/${id}`);
    },
  });

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSentimentChange = (sentiment: Sentiment) => {
    setFormData({ ...formData, sentiment });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Review: {event?.name}</h1>
      <p className="text-muted-foreground mb-6">Share your feedback about this event</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitMutation.error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
            Failed to submit review. Please try again.
          </div>
        )}

        {/* Star Rating */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">Overall Rating</h2>
          </div>
          <div className="card-content">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-4xl transition-colors ${
                    star <= formData.rating ? 'text-yellow-500' : 'text-muted-foreground/30'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">How did you feel?</h2>
          </div>
          <div className="card-content">
            <div className="flex gap-4">
              {[
                { value: 'positive', label: 'Positive', emoji: '😊', color: 'bg-success/20 border-success text-success' },
                { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-info/20 border-info text-info' },
                { value: 'negative', label: 'Negative', emoji: '😞', color: 'bg-danger/20 border-danger text-danger' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSentimentChange(option.value as Sentiment)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    formData.sentiment === option.value
                      ? option.color
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        {event?.enable_textbox && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title text-lg">Additional Comments</h2>
            </div>
            <div className="card-content">
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="input min-h-[100px]"
                placeholder="Share your thoughts..."
                rows={4}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventReviewPage;
