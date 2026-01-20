import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/api';
import { useAuthStore } from '@/stores';
import { format, isPast, isFuture } from 'date-fns';
import type { Event } from '@/types';

type StatusFilter = 'all' | 'upcoming' | 'past';
type SortOption = 'newest' | 'oldest' | 'name' | 'rating';

// Rating distribution chart
function RatingChart({ data }: { data: Record<string, number> }) {
  const maxValue = Math.max(...Object.values(data), 1);
  const colors = ['bg-danger', 'bg-warning', 'bg-info', 'bg-success/70', 'bg-success'];

  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((rating) => {
        const count = data[rating.toString()] || 0;
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2">
            <span className="w-8 text-sm text-muted-foreground">{rating}★</span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${colors[rating - 1]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

// Sentiment distribution chart
function SentimentChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const sentiments = [
    { key: 'positive', label: 'Positive', color: 'bg-success' },
    { key: 'neutral', label: 'Neutral', color: 'bg-info' },
    { key: 'negative', label: 'Negative', color: 'bg-danger' },
  ];

  return (
    <div className="space-y-3">
      {sentiments.map(({ key, label, color }) => {
        const count = data[key] || 0;
        const percentage = Math.round((count / total) * 100);
        return (
          <div key={key} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Event Card Component
function EventCard({ event, variant = 'default' }: { event: Event; variant?: 'default' | 'compact' | 'featured' }) {
  const isUpcoming = isFuture(new Date(event.start_at));
  const eventEnded = isPast(new Date(event.end_at));

  if (variant === 'featured') {
    return (
      <div className="card overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="relative">
          {event.images[0] ? (
            <img
              src={event.images[0]}
              alt={event.name}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-purple to-violet flex items-center justify-center">
              <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          {isUpcoming && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-success text-white text-xs font-medium rounded-full">
              Upcoming
            </span>
          )}
          {eventEnded && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
              Ended
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{event.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(event.start_at), 'MMM d, yyyy')}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span>{event.songs_count} songs</span>
            <span>{event.reviews_count} reviews</span>
            {event.average_rating && (
              <span className="text-info">★ {Number(event.average_rating).toFixed(1)}</span>
            )}
          </div>
        </div>
        <div className="card-footer gap-2">
          <Link to={`/events/${event.id}`} className="btn-outline flex-1 text-center">
            View
          </Link>
          <Link to={`/events/${event.id}/dashboard`} className="btn-primary flex-1 text-center">
            Manage
          </Link>
        </div>
      </div>
    );
  }

  // Compact variant for lists
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
      {event.images[0] ? (
        <img
          src={event.images[0]}
          alt={event.name}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 bg-gradient-to-br from-purple to-violet rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{event.name}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.start_at), 'MMM d, yyyy')}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{event.songs_count} songs</span>
          <span>{event.reviews_count} reviews</span>
          {event.average_rating && (
            <span className="text-info">★ {Number(event.average_rating).toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Link to={`/events/${event.id}/dashboard`} className="btn-primary text-sm py-1.5 px-3">
          Manage
        </Link>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.getAll,
    refetchInterval: 30000, // Poll every 30 seconds for real-time updates
  });

  const { data: stats } = useQuery({
    queryKey: ['events', 'stats'],
    queryFn: eventsApi.getStats,
    refetchInterval: 30000, // Poll every 30 seconds for real-time updates
  });

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let result = [...events];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.venue?.name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter === 'upcoming') {
      result = result.filter((event) => isFuture(new Date(event.start_at)));
    } else if (statusFilter === 'past') {
      result = result.filter((event) => isPast(new Date(event.end_at)));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.start_at).getTime() - new Date(a.start_at).getTime();
        case 'oldest':
          return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [events, searchQuery, statusFilter, sortOption]);

  // Categorize events for default view
  // Recent events - latest 4 by start_at
  const recentEvents = events
    ? [...events]
        .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
        .slice(0, 4)
    : [];

  // Upcoming events - events that haven't started yet
  const upcomingEvents = events
    ? events
        .filter((event) => isFuture(new Date(event.start_at)))
        .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    : [];

  // Past events - events that have ended
  const pastEvents = events
    ? events
        .filter((event) => isPast(new Date(event.end_at)))
        .sort((a, b) => new Date(b.end_at).getTime() - new Date(a.end_at).getTime())
    : [];

  // Check if filters are active
  const isFiltering = searchQuery.trim() !== '' || statusFilter !== 'all';

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
        Failed to load events. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-muted-foreground mt-1">Manage your events and view analytics</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
              style={{ paddingLeft: '2.5rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden btn-outline flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {isFiltering && (
              <span className="w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>

          {/* Filter Controls (Desktop always visible, Mobile collapsible) */}
          <div className={`flex flex-col sm:flex-row gap-3 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="input min-w-[140px]"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="input min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Clear Filters */}
            {isFiltering && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="btn-ghost text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Search Results Count */}
        {isFiltering && events && (
          <p className="text-sm text-muted-foreground mt-3">
            {filteredEvents.length} of {events.length} events
          </p>
        )}
      </div>

      {/* Aggregated Stats */}
      {stats && stats.total_reviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Stats - Gradient Card */}
          <div className="card-gradient rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white/90 mb-4">Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total Events</span>
                  <span className="text-3xl font-bold text-white">{stats.total_events}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total Reviews</span>
                  <span className="text-3xl font-bold text-white">{stats.total_reviews}</span>
                </div>
                {stats.average_rating && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Average Rating</span>
                    <span className="text-3xl font-bold text-info">
                      {stats.average_rating} ★
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title text-lg">Rating Distribution</h2>
            </div>
            <div className="card-content">
              <RatingChart data={stats.rating_distribution} />
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title text-lg">Sentiment Distribution</h2>
            </div>
            <div className="card-content">
              <SentimentChart data={stats.sentiment_distribution} />
            </div>
          </div>
        </div>
      )}

      {/* Events Sections */}
      {events && events.length > 0 ? (
        <>
          {/* Filtered Results View */}
          {isFiltering ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
              </div>
              {filteredEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} variant="featured" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <div className="card-content">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No events found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Recent Events - Latest 4 */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Events</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {recentEvents.map((event) => (
                    <EventCard key={event.id} event={event} variant="featured" />
                  ))}
                </div>
              </section>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        Upcoming Events
                      </span>
                    </h2>
                    <span className="text-sm text-muted-foreground">{upcomingEvents.length} events</span>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} variant="compact" />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground text-muted-foreground">Past Events</h2>
                    <span className="text-sm text-muted-foreground">{pastEvents.length} events</span>
                  </div>
                  <div className="space-y-3 opacity-75">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} variant="compact" />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-12 card">
          <div className="card-content">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No events yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first event to get started
            </p>
            <Link to="/events/new" className="btn-gradient rounded-lg">
              Create Event
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
