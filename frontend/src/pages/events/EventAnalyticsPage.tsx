import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { eventsApi, reviewsApi } from '@/api';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

const SENTIMENT_CONFIG = {
  positive: { color: '#22c55e', bgColor: 'bg-success/20', textColor: 'text-success', label: 'Positive' },
  neutral: { color: '#6b7280', bgColor: 'bg-muted', textColor: 'text-muted-foreground', label: 'Neutral' },
  negative: { color: '#ef4444', bgColor: 'bg-danger/20', textColor: 'text-danger', label: 'Negative' },
};

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card px-4 py-3 rounded-lg shadow-lg border border-border">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-primary font-bold text-lg">{payload[0].value} reviews</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card px-4 py-3 rounded-lg shadow-lg border border-border">
        <p className="font-medium" style={{ color: payload[0].payload.color }}>
          {payload[0].name}
        </p>
        <p className="text-foreground font-bold text-lg">{payload[0].value} reviews</p>
      </div>
    );
  }
  return null;
};

// Custom legend for pie chart
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function EventAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id, 'analytics'],
    queryFn: () => eventsApi.getAnalytics(Number(id)),
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: number; reply: string }) =>
      reviewsApi.replyToEventReview(Number(id), reviewId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id, 'analytics'] });
      setReplyingTo(null);
      setReplyText('');
    },
  });

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (!event) return;

    const rows: string[][] = [];

    // Header
    rows.push(['Analytics Report', event.name]);
    rows.push(['Generated', format(new Date(), 'PPP p')]);
    rows.push([]);

    // Overview
    rows.push(['Summary']);
    rows.push(['Total Reviews', String(event.reviews_count)]);
    rows.push(['Average Rating', event.average_rating ? String(Number(event.average_rating).toFixed(1)) : 'N/A']);
    rows.push([]);

    // Rating Distribution
    rows.push(['Rating Distribution']);
    rows.push(['Rating', 'Count']);
    [1, 2, 3, 4, 5].forEach(rating => {
      const count = (event.rating_distribution || {})[rating.toString()] || 0;
      rows.push([`${rating} Star`, String(count)]);
    });
    rows.push([]);

    // Sentiment Distribution
    rows.push(['Sentiment Distribution']);
    rows.push(['Sentiment', 'Count']);
    Object.entries(event.sentiment_distribution || {}).forEach(([sentiment, count]) => {
      rows.push([sentiment.charAt(0).toUpperCase() + sentiment.slice(1), String(count)]);
    });
    rows.push([]);

    // Reviews
    if (event.recent_reviews && event.recent_reviews.length > 0) {
      rows.push(['Recent Reviews']);
      rows.push(['Date', 'Rating', 'Sentiment', 'Comment']);
      event.recent_reviews.forEach(review => {
        rows.push([
          format(new Date(review.created_at), 'PPP'),
          review.rating ? `${review.rating} Star` : 'N/A',
          review.sentiment || 'N/A',
          review.comment || ''
        ]);
      });
    }

    // Convert to CSV string
    const csvContent = rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.name}_analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [event]);

  // Print/Export to PDF
  const exportToPDF = useCallback(() => {
    window.print();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
        Failed to load analytics.
      </div>
    );
  }

  // Prepare rating data - ensure all ratings 1-5 are present
  const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating}★`,
    count: (event.rating_distribution || {})[rating.toString()] || 0,
    fill: RATING_COLORS[rating - 1],
  }));

  const sentimentData = Object.entries(event.sentiment_distribution || {})
    .filter(([_, count]) => (count as number) > 0)
    .map(([sentiment, count]) => ({
      name: SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG]?.label || sentiment,
      value: count as number,
      color: SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG]?.color || '#6b7280',
    }));

  const totalReviews = event.reviews_count;
  const avgRating = Number(event.average_rating) || 0;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
          <p className="text-muted-foreground">Analytics & Insights</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportToCSV} className="btn-outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button onClick={exportToPDF} className="btn-outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / PDF
          </button>
          <Link to={`/events/${event.id}/dashboard`} className="btn-outline">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">{totalReviews}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-info" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">
                {avgRating ? avgRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <span className="text-2xl">
                {avgRating >= 4 ? '😊' : avgRating >= 3 ? '😐' : avgRating > 0 ? '😞' : '❓'}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">
                {'★'.repeat(Math.round(avgRating))}
                <span className="text-border">{'★'.repeat(5 - Math.round(avgRating))}</span>
              </div>
              <div className="text-sm text-muted-foreground">Star Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Rating Distribution</h2>
            <p className="card-description">How users rated this event</p>
          </div>
          <div className="card-content">
            {ratingData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <XAxis
                    dataKey="rating"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 14 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  >
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No rating data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sentiment Distribution</h2>
            <p className="card-description">Overall audience mood</p>
          </div>
          <div className="card-content">
            {sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No sentiment data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Reviews</h2>
          <p className="card-description">Latest feedback from your audience</p>
        </div>
        <div className="card-content">
          {event.recent_reviews && event.recent_reviews.length > 0 ? (
            <div className="space-y-4">
              {event.recent_reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-info">
                        {'★'.repeat(review.rating || 0)}
                        <span className="text-border">{'★'.repeat(5 - (review.rating || 0))}</span>
                      </span>
                      {review.sentiment && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            SENTIMENT_CONFIG[review.sentiment as keyof typeof SENTIMENT_CONFIG]?.bgColor
                          } ${SENTIMENT_CONFIG[review.sentiment as keyof typeof SENTIMENT_CONFIG]?.textColor}`}
                        >
                          {SENTIMENT_CONFIG[review.sentiment as keyof typeof SENTIMENT_CONFIG]?.label || review.sentiment}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-foreground leading-relaxed">{review.comment}</p>
                  )}

                  {/* Reply section */}
                  {review.reply ? (
                    <div className="mt-3 pl-4 border-l-2 border-primary/30">
                      <div className="text-xs text-muted-foreground mb-1">
                        Your reply ({format(new Date(review.replied_at!), 'PP')})
                      </div>
                      <p className="text-sm text-foreground">{review.reply}</p>
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="mt-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="input min-h-[80px] w-full"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => replyMutation.mutate({ reviewId: review.id, reply: replyText })}
                          disabled={!replyText.trim() || replyMutation.isPending}
                          className="btn-primary text-sm"
                        >
                          {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="btn-outline text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(review.id)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Reply to this review
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventAnalyticsPage;
