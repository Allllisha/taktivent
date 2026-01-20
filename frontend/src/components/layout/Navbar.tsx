import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a public event page (event show, song show, or review pages)
  const isPublicEventPage = /^\/events\/\d+/.test(location.pathname) && !location.pathname.includes('/dashboard') && !location.pathname.includes('/analytics') && !location.pathname.includes('/edit') && !location.pathname.includes('/new');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Taktivent</span>
          </Link>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Profile icon - clickable to go to profile */}
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="avatar avatar-sm">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </div>
                  <span className="text-sm text-white hidden sm:inline">
                    {user?.first_name} {user?.last_name}
                  </span>
                </Link>

                {/* Desktop logout button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex text-sm text-white/80 hover:text-white transition-colors items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>

                {/* Mobile menu button - right side next to profile */}
                {onMenuToggle && (
                  <button
                    onClick={onMenuToggle}
                    className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              // Only show Login/Sign Up on non-event pages (event pages act like flyers)
              !isPublicEventPage && (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm text-white/90 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-white text-violet-600 px-4 py-2 rounded font-medium hover:bg-white/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
