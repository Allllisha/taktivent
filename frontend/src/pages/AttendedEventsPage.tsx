import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api';
import { format, isPast } from 'date-fns';
import type { Event } from '@/types';

function EventCard({ event }: { event: Event }) {
  const eventEnded = isPast(new Date(event.end_at));

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
        {eventEnded && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            Ended
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{event.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(event.start_at), 'PPP')}
        </p>
        {event.venue?.name && (
          <p className="text-sm text-muted-foreground">
            {event.venue.name}
          </p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span>{event.songs_count} songs</span>
          {event.average_rating && (
            <span className="text-info">★ {Number(event.average_rating).toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="card-footer">
        <Link to={`/events/${event.id}`} className="btn-primary flex-1 text-center">
          View Event
        </Link>
      </div>
    </div>
  );
}

export function AttendedEventsPage() {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['attended-events'],
    queryFn: authApi.getAttendedEvents,
  });

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
        Failed to load attended events.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Attended Events</h1>
        <p className="text-muted-foreground mt-1">
          Events you've participated in and reviewed
        </p>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <div className="card-content">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No attended events yet
            </h3>
            <p className="text-muted-foreground mb-6">
              When you review events, they'll appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendedEventsPage;
