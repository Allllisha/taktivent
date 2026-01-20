import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          top: '88px',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center py-12 relative z-10">
        <div className="animate-float mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-purple via-violet to-cyan bg-clip-text text-transparent">
            Taktivent
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-white/90 md:text-xl mb-10">
          Transform your event flyers into interactive experiences.
          <br />
          Collect real-time audience feedback and analytics.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-gradient px-10 py-4 text-lg rounded-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-gradient px-10 py-4 text-lg rounded-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn-outline px-10 py-4 text-lg rounded-lg border-white text-white hover:bg-white/10">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 relative z-10">
        <div className="card-gradient p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">QR Code Access</h3>
          <p className="text-white/80">
            Generate QR codes for easy audience access to your event pages
          </p>
        </div>

        <div className="card-gradient p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Real-time Reviews</h3>
          <p className="text-white/80">
            Collect ratings and feedback from your audience in real-time
          </p>
        </div>

        <div className="card-gradient p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
          <p className="text-white/80">
            Visualize sentiment analysis and rating distributions
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 py-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-white font-semibold">Taktivent</span>
          </div>

          <div className="flex items-center gap-6 text-white/70 text-sm">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Taktivent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
