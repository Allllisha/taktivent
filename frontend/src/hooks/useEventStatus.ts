import { useState, useEffect, useMemo } from 'react';
import { differenceInSeconds, isPast, isFuture } from 'date-fns';
import type { Event, Song } from '@/types';

export type EventPhase = 'upcoming' | 'live' | 'ended';

export interface EventStatus {
  phase: EventPhase;
  isUpcoming: boolean;
  isLive: boolean;
  isEnded: boolean;
  countdown: string;
  countdownSeconds: number;
  nowPlayingSong: Song | null;
  nextSong: Song | null;
  previousSong: Song | null;
}

export function useEventStatus(event: Event | undefined): EventStatus {
  const [now, setNow] = useState(() => new Date());

  // Update every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!event) {
      return {
        phase: 'upcoming' as EventPhase,
        isUpcoming: true,
        isLive: false,
        isEnded: false,
        countdown: '',
        countdownSeconds: 0,
        nowPlayingSong: null,
        nextSong: null,
        previousSong: null,
      };
    }

    const startTime = new Date(event.start_at);
    const endTime = new Date(event.end_at);

    const isUpcoming = isFuture(startTime);
    const isEnded = isPast(endTime);
    const isLive = !isUpcoming && !isEnded;

    let phase: EventPhase = 'upcoming';
    if (isLive) phase = 'live';
    if (isEnded) phase = 'ended';

    // Countdown calculation
    const diff = differenceInSeconds(startTime, now);
    let countdown = '';
    let countdownSeconds = Math.max(0, diff);

    if (diff > 0) {
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) {
        countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (hours > 0) {
        countdown = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        countdown = `${minutes}m ${seconds}s`;
      } else {
        countdown = `${seconds}s`;
      }
    }

    // Find now playing song
    let nowPlayingSong: Song | null = null;
    let nextSong: Song | null = null;
    let previousSong: Song | null = null;

    if (event.songs && event.songs.length > 0) {
      const sortedSongs = [...event.songs].sort(
        (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );

      for (let i = 0; i < sortedSongs.length; i++) {
        const song = sortedSongs[i];
        const songStart = new Date(song.start_at);
        const songEnd = new Date(songStart.getTime() + song.length_in_minute * 60000);

        if (now >= songStart && now <= songEnd) {
          nowPlayingSong = song;
          previousSong = i > 0 ? sortedSongs[i - 1] : null;
          nextSong = i < sortedSongs.length - 1 ? sortedSongs[i + 1] : null;
          break;
        }

        // If we haven't found a now playing song yet, track the next upcoming song
        if (!nowPlayingSong && now < songStart) {
          nextSong = song;
          previousSong = i > 0 ? sortedSongs[i - 1] : null;
          break;
        }
      }

      // If all songs have ended, set previousSong to the last one
      if (!nowPlayingSong && !nextSong && sortedSongs.length > 0) {
        previousSong = sortedSongs[sortedSongs.length - 1];
      }
    }

    return {
      phase,
      isUpcoming,
      isLive,
      isEnded,
      countdown,
      countdownSeconds,
      nowPlayingSong,
      nextSong,
      previousSong,
    };
  }, [event, now]);
}

// Hook for individual song status
export interface SongStatus {
  isUpcoming: boolean;
  isPlaying: boolean;
  isEnded: boolean;
  countdown: string;
  countdownSeconds: number;
  progress: number; // 0-100
}

export function useSongStatus(song: Song | undefined): SongStatus {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!song) {
      return {
        isUpcoming: true,
        isPlaying: false,
        isEnded: false,
        countdown: '',
        countdownSeconds: 0,
        progress: 0,
      };
    }

    const songStart = new Date(song.start_at);
    const songEnd = new Date(songStart.getTime() + song.length_in_minute * 60000);

    const isUpcoming = isFuture(songStart);
    const isEnded = isPast(songEnd);
    const isPlaying = !isUpcoming && !isEnded;

    // Countdown to song start
    const diff = differenceInSeconds(songStart, now);
    let countdown = '';
    let countdownSeconds = Math.max(0, diff);

    if (diff > 0) {
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      countdown = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }

    // Progress calculation (0-100)
    let progress = 0;
    if (isPlaying) {
      const elapsed = differenceInSeconds(now, songStart);
      const duration = song.length_in_minute * 60;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
    } else if (isEnded) {
      progress = 100;
    }

    return {
      isUpcoming,
      isPlaying,
      isEnded,
      countdown,
      countdownSeconds,
      progress,
    };
  }, [song, now]);
}
