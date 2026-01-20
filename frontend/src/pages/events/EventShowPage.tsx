import { useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/api';
import { format, isPast } from 'date-fns';
import { useEventStatus } from '@/hooks';
import { useAuthStore } from '@/stores/authStore';
import { MusicVisualizer } from '@/components/ui';
import type { Song } from '@/types';

// Share URL helpers
const getShareUrl = () => window.location.href;
const getShareText = (eventName: string) => `${eventName} - Check out this event!`;

const shareToTwitter = (eventName: string) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(eventName))}&url=${encodeURIComponent(getShareUrl())}`;
  window.open(url, '_blank', 'width=550,height=420');
};

const shareToLine = (eventName: string) => {
  const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareText(eventName))}`;
  window.open(url, '_blank', 'width=550,height=420');
};

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
  window.open(url, '_blank', 'width=550,height=420');
};

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(getShareUrl());
};

export function EventShowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(Number(id)),
    refetchInterval: 30000, // Poll every 30 seconds for real-time updates (Now Playing, etc.)
  });

  const status = useEventStatus(event);

  // Handle song click navigation
  const handleSongClick = useCallback((song: Song) => {
    navigate(`/events/${id}/songs/${song.id}`);
  }, [navigate, id]);

  // Handle song double-click to go directly to review
  const handleSongDoubleClick = useCallback((song: Song) => {
    const songStart = new Date(song.start_at);
    const now = new Date();

    // Only allow review if song has started
    if (now >= songStart) {
      navigate(`/events/${id}/songs/${song.id}/review`);
    }
  }, [navigate, id]);

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
        Failed to load event.
      </div>
    );
  }

  const eventStarted = isPast(new Date(event.start_at));
  const eventEnded = isPast(new Date(event.end_at));
  const isOwner = user?.id === event.user_id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Event Header */}
      <div className="card mb-6">
        {event.images[0] && (
          <img
            src={event.images[0]}
            alt={event.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{event.name}</h1>

          {/* Event Status Badge */}
          <div className="mb-4">
            {status.isUpcoming && (
              <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg inline-block">
                <span className="font-medium">Starts in:</span> {status.countdown}
              </div>
            )}
            {status.isLive && (
              <div className="bg-success/20 text-success px-4 py-2 rounded-lg inline-flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                <span className="font-medium">Live Now</span>
              </div>
            )}
            {status.isEnded && (
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg inline-block">
                <span className="font-medium">Event has ended</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
            <div>
              <span className="font-medium text-foreground">Start:</span>{' '}
              {format(new Date(event.start_at), 'PPP p')}
            </div>
            <div>
              <span className="font-medium text-foreground">End:</span>{' '}
              {format(new Date(event.end_at), 'PPP p')}
            </div>
          </div>

          <div className="mb-4">
            <span className="font-medium">Venue:</span> {event.venue.name}
            {event.venue.address && <span className="text-muted-foreground"> - {event.venue.address}</span>}
          </div>

          {event.description && (
            <p className="text-muted-foreground">{event.description}</p>
          )}

          {/* Share Buttons */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Share this event:</p>
            <div className="flex gap-3">
              <button
                onClick={() => shareToTwitter(event.name)}
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button
                onClick={() => shareToLine(event.name)}
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="LINE"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              </button>
              <button
                onClick={shareToFacebook}
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={async () => {
                  await copyToClipboard();
                  alert('Link copied to clipboard!');
                }}
                className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Copy Link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing Card */}
      {status.nowPlayingSong && (
        <div className="card mb-6 border-2 border-primary">
          <div className="card-header bg-primary/10">
            <div className="flex items-center gap-3">
              <MusicVisualizer isPlaying={true} barCount={4} className="h-6" />
              <h2 className="card-title text-primary">Now Playing</h2>
            </div>
          </div>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{status.nowPlayingSong.name}</h3>
                <p className="text-muted-foreground">{status.nowPlayingSong.composer_name}</p>
                {status.nowPlayingSong.performers && status.nowPlayingSong.performers.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Performed by: {status.nowPlayingSong.performers.map(p => p.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/events/${id}/songs/${status.nowPlayingSong.id}`}
                  className="btn-outline"
                >
                  View
                </Link>
                <Link
                  to={`/events/${id}/songs/${status.nowPlayingSong.id}/review`}
                  className="btn-primary"
                >
                  Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programme */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Programme</h2>
          <p className="card-description">Click a song to view details, double-click to review</p>
        </div>
        <div className="card-content">
          {event.songs && event.songs.length > 0 ? (
            <div className="space-y-2">
              {[...event.songs]
                .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
                .map((song, index) => {
                  const songStart = new Date(song.start_at);
                  const songEnd = new Date(songStart.getTime() + song.length_in_minute * 60000);
                  const now = new Date();

                  const songStarted = now >= songStart;
                  const songEnded = now >= songEnd;
                  const isPlaying = songStarted && !songEnded;

                  return (
                    <div
                      key={song.id}
                      onClick={() => handleSongClick(song)}
                      onDoubleClick={() => handleSongDoubleClick(song)}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        isPlaying
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : songEnded
                          ? 'border-border bg-muted/50 opacity-70'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Track Number */}
                        <div className={`text-lg font-bold w-8 ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}>
                          {index + 1}
                        </div>

                        {/* Time */}
                        <div className={`text-sm w-16 ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}>
                          {format(songStart, 'HH:mm')}
                        </div>

                        {/* Song Info */}
                        <div>
                          <div className={`font-medium ${songEnded ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {song.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{song.composer_name}</div>
                        </div>

                        {/* Now Playing Indicator */}
                        {isPlaying && (
                          <div className="flex items-center gap-2">
                            <MusicVisualizer isPlaying={true} barCount={3} className="h-4" />
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                              Now Playing
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{song.length_in_minute} min</span>

                        {/* Review indicator */}
                        {song.reviews_count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {song.reviews_count} review{song.reviews_count !== 1 ? 's' : ''}
                          </span>
                        )}

                        {/* Average rating */}
                        {song.average_rating && (
                          <span className="text-yellow-500 text-sm">
                            ★ {Number(song.average_rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-muted-foreground">No songs in the programme yet.</p>
          )}
        </div>
      </div>

      {/* Event Review Section - Only show after event started */}
      {eventStarted && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Leave a Review</h2>
            <p className="card-description">
              {eventEnded
                ? 'Share your overall feedback about this event'
                : 'Share your thoughts while the event is happening'}
            </p>
          </div>
          <div className="card-content">
            <div className="flex items-center gap-4">
              <Link
                to={`/events/${event.id}/review`}
                className="btn-primary"
              >
                Review Event
              </Link>
              {isOwner && event.reviews_count > 0 && (
                <span className="text-muted-foreground">
                  {event.reviews_count} review{event.reviews_count !== 1 ? 's' : ''} submitted
                </span>
              )}
              {isOwner && event.average_rating && (
                <span className="text-yellow-500">
                  ★ {Number(event.average_rating).toFixed(1)} average
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-event message */}
      {!eventStarted && (
        <div className="card bg-muted">
          <div className="card-content text-center py-8">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Event hasn't started yet
            </h3>
            <p className="text-muted-foreground">
              Reviews will be available once the event begins.
              <br />
              Come back in <strong className="text-foreground">{status.countdown}</strong>!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventShowPage;
