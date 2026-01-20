interface MusicVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

export function MusicVisualizer({
  isPlaying = true,
  barCount = 4,
  className = ''
}: MusicVisualizerProps) {
  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className={`w-1 bg-primary rounded-sm ${
            isPlaying ? 'animate-music-bar' : 'h-1'
          }`}
          style={{
            animationDelay: `${index * 0.1}s`,
            height: isPlaying ? undefined : '4px',
          }}
        />
      ))}
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .animate-music-bar {
          animation: music-bar 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MusicVisualizer;
