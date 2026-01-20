import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { songsApi, eventsApi } from '@/api';
import { format } from 'date-fns';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { MusicVisualizer } from '@/components/ui/MusicVisualizer';
import { useSongStatus } from '@/hooks';
import type { Performer } from '@/types';

export function SongShowPage() {
  const { id: eventId, songId } = useParams<{ id: string; songId: string }>();
  const navigate = useNavigate();
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getById(Number(eventId)),
  });

  const { data: song, isLoading, error } = useQuery({
    queryKey: ['song', eventId, songId],
    queryFn: () => songsApi.getById(Number(eventId), Number(songId)),
  });

  const songStatus = useSongStatus(song);

  // Find adjacent songs for navigation
  const { prevSong, nextSong, currentIndex, totalSongs } = useMemo(() => {
    if (!event?.songs || !songId) {
      return { prevSong: null, nextSong: null, currentIndex: -1, totalSongs: 0 };
    }

    const sortedSongs = [...event.songs].sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );

    const currentIdx = sortedSongs.findIndex((s) => s.id === Number(songId));

    return {
      prevSong: currentIdx > 0 ? sortedSongs[currentIdx - 1] : null,
      nextSong: currentIdx < sortedSongs.length - 1 ? sortedSongs[currentIdx + 1] : null,
      currentIndex: currentIdx,
      totalSongs: sortedSongs.length,
    };
  }, [event?.songs, songId]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevSong) {
        navigate(`/events/${eventId}/songs/${prevSong.id}`);
      } else if (e.key === 'ArrowRight' && nextSong) {
        navigate(`/events/${eventId}/songs/${nextSong.id}`);
      } else if (e.key === 'Escape') {
        navigate(`/events/${eventId}`);
      } else if (e.key === 'r' || e.key === 'R') {
        if (song && !songStatus.isUpcoming) {
          navigate(`/events/${eventId}/songs/${songId}/review`);
        }
      }
    },
    [prevSong, nextSong, navigate, eventId, songId, song, songStatus.isUpcoming]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
        Failed to load song details.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section with Image Carousel */}
      <div className="relative mb-6">
        {/* Navigation overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          {/* Back button */}
          <Link
            to={`/events/${eventId}`}
            className="flex items-center gap-2 bg-card/90 backdrop-blur-sm text-foreground px-3 py-2 rounded-full shadow-lg hover:bg-card transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {event?.name || 'Back'}
          </Link>

          {/* Track navigation */}
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg px-2 py-1">
            <button
              onClick={() => prevSong && navigate(`/events/${eventId}/songs/${prevSong.id}`)}
              disabled={!prevSong}
              className={`p-1.5 rounded-full transition-colors ${
                prevSong ? 'hover:bg-muted text-foreground' : 'text-muted-foreground cursor-not-allowed'
              }`}
              title="Previous song"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-muted-foreground px-2">
              {currentIndex + 1} / {totalSongs}
            </span>
            <button
              onClick={() => nextSong && navigate(`/events/${eventId}/songs/${nextSong.id}`)}
              disabled={!nextSong}
              className={`p-1.5 rounded-full transition-colors ${
                nextSong ? 'hover:bg-muted text-foreground' : 'text-muted-foreground cursor-not-allowed'
              }`}
              title="Next song"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Carousel with auto-play */}
        <ImageCarousel
          images={song.images}
          alt={song.name}
          autoPlay={true}
          autoPlayInterval={5000}
          showThumbnails={false}
          aspectRatio="wide"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {/* Title and Status Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Title with Visualizer */}
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{song.name}</h1>
              {songStatus.isPlaying && <MusicVisualizer isPlaying={true} />}
            </div>
            <p className="text-lg text-muted-foreground">{song.composer_name}</p>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            {songStatus.isPlaying ? (
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Now Playing
              </div>
            ) : songStatus.isEnded ? (
              <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Finished
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upcoming
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar (for playing songs) */}
        {songStatus.isPlaying && (
          <div className="card p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{songStatus.progress}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple via-violet to-cyan h-3 rounded-full transition-all duration-1000"
                style={{ width: `${songStatus.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Countdown (for upcoming songs) */}
        {songStatus.isUpcoming && songStatus.countdown && (
          <div className="card p-4 bg-primary/5 border-primary/20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Starts in</div>
              <div className="text-2xl font-bold text-primary">{songStatus.countdown}</div>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{format(new Date(song.start_at), 'HH:mm')}</div>
            <div className="text-sm text-muted-foreground">Start Time</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{song.length_in_minute}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          {song.average_rating && (
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-info">{Number(song.average_rating).toFixed(1)} ★</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          )}
          {song.reviews_count !== undefined && (
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{song.reviews_count}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          )}
        </div>

        {/* Description and Performers Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          {song.description && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title text-lg">About this piece</h2>
              </div>
              <div className="card-content">
                <p className="text-muted-foreground whitespace-pre-wrap">{song.description}</p>
              </div>
            </div>
          )}

          {/* Performers */}
          {song.performers && song.performers.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title text-lg">Performers</h2>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {song.performers.map((performer) => (
                    <button
                      key={performer.id}
                      onClick={() => setSelectedPerformer(performer)}
                      className="flex items-center gap-3 w-full text-left hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple to-violet rounded-full flex items-center justify-center text-white font-medium">
                        {performer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{performer.name}</div>
                        {performer.description && (
                          <p className="text-sm text-muted-foreground truncate">{performer.description}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Button */}
        <div className="sticky bottom-4 z-10">
          {songStatus.isUpcoming ? (
            <div className="bg-muted text-muted-foreground text-center py-4 rounded-xl shadow-lg">
              Reviews available once the song starts
            </div>
          ) : (
            <Link
              to={`/events/${eventId}/songs/${songId}/review`}
              className="block w-full text-center py-4 rounded-xl text-white font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #AF40FF 0%, #5B42F3 50%, #00DDEB 100%)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Leave a Review
                <span className="text-white/70 text-sm">(Press R)</span>
              </span>
            </Link>
          )}
        </div>

        {/* Adjacent Songs Navigation */}
        {(prevSong || nextSong) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            {prevSong ? (
              <Link
                to={`/events/${eventId}/songs/${prevSong.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl hover:bg-muted transition-colors"
              >
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium text-foreground truncate">{prevSong.name}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextSong && (
              <Link
                to={`/events/${eventId}/songs/${nextSong.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl hover:bg-muted transition-colors text-right"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium text-foreground truncate">{nextSong.name}</div>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="text-xs text-muted-foreground text-center space-x-4 pb-4">
          <span>← Previous</span>
          <span>→ Next</span>
          <span>R Review</span>
          <span>Esc Back</span>
        </div>
      </div>

      {/* Performer Detail Modal */}
      {selectedPerformer && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPerformer(null)}
        >
          <div
            className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple to-violet rounded-full flex items-center justify-center text-white text-2xl font-medium">
                    {selectedPerformer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedPerformer.name}</h3>
                    {selectedPerformer.description && (
                      <p className="text-sm text-muted-foreground">{selectedPerformer.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPerformer(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedPerformer.bio && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Biography</h4>
                  <p className="text-foreground whitespace-pre-wrap">{selectedPerformer.bio}</p>
                </div>
              )}

              {!selectedPerformer.bio && !selectedPerformer.description && (
                <p className="text-muted-foreground text-center py-4">
                  No additional information available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongShowPage;
