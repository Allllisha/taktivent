import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui';
import { useAuthStore } from '@/stores';

// Navbar height: h-16 (64px) + padding 0.75rem*2 (24px) = 88px
const NAVBAR_HEIGHT = '88px';

export function Layout() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {isAuthenticated ? (
        <>
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Fixed Sidebar */}
          <div
            className={`
              fixed bottom-0 left-0 z-40
              w-64 md:w-[20%] md:min-w-[200px] md:max-w-[280px]
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{ top: NAVBAR_HEIGHT }}
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>

          {/* Main content with left margin for sidebar */}
          <main className="md:ml-[20%] md:min-w-0" style={{ paddingTop: NAVBAR_HEIGHT, minHeight: '100vh' }}>
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </>
      ) : (
        // Non-authenticated layout (full width)
        <main style={{ paddingTop: NAVBAR_HEIGHT, minHeight: '100vh' }}>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
}

export default Layout;
