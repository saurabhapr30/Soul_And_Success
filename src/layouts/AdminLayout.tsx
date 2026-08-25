import { useState, useEffect } from 'react';
import { Outlet, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AdminLayout.css';

type NavItem = {
  to: string;
  label: string;
  icon: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: '◈', exact: true },
  { to: '/admin/orders', label: 'Orders', icon: '◎' },
  { to: '/admin/courses', label: 'Courses', icon: '▶' },
  { to: '/admin/books', label: 'Books', icon: '📚' },
  { to: '/admin/merchandise', label: 'Merchandise', icon: '🛍️' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '❝' },
  { to: '/admin/blogs', label: 'Blogs', icon: '✎' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎫' },
  { to: '/admin/contact', label: 'Messages', icon: '✉' },
  { to: '/admin/newsletter', label: 'Subscribers', icon: '📬' },
];

export function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getMe();
        const userData = res?.data?.user || res?.data || res;
        setUser(userData);
      } catch (err) {
        console.error('Not authenticated', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    authService.logout();
    setLoggingOut(false);
    navigate('/login?redirect=/admin', { replace: true });
  };

  if (loading) {
    return (
      <div style={{ background: '#0e0c0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', fontFamily: "var(--font-body)" }}>
        Loading Admin Panel...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const role = user?.role || user?.data?.role;
  if (role !== 'ADMIN') {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#0e0c0b', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ maxWidth: '500px', backgroundColor: '#1a1310', border: '1px solid rgba(226,125,96,0.3)', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#E27D60', marginBottom: '16px', fontFamily: "var(--font-body)", letterSpacing: '0.05em' }}>Access Denied</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.6', fontSize: '0.9rem' }}>
            You are logged in as <strong style={{ color: '#fff' }}>{user.email}</strong> (Role: <code style={{ color: '#D4A96A' }}>{role || 'CUSTOMER'}</code>). You need an <strong style={{ color: '#fff' }}>ADMIN</strong> account to access the Admin Panel.
          </p>
          <button 
            onClick={handleLogout}
            style={{ background: 'linear-gradient(135deg, #E27D60, #D4A96A)', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "var(--font-body)", letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  const currentNavItem = navItems.find((n) => n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to) && n.to !== '/admin');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0e0c0b', color: '#fff', fontFamily: "'Nunito Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside 
        className={`admin-luxury-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: '16rem',
          flexShrink: 0,
          background: 'linear-gradient(180deg, #1a1310 0%, #150f0d 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: "var(--font-display-secondary)", fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #E27D60, #D4A96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', letterSpacing: '0.08em' }}>
              SOUL & SUCCESS
            </span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0.4rem 0 0' }}>
              Admin Panel
            </p>
          </div>
          <button className="admin-mobile-close" onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.25rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '1rem 0.875rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-logout-btn"
          >
            <span>⏻</span>
            <span>{loggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main-wrapper">
        {/* Top Header */}
        <header style={{
          height: '4rem',
          background: 'rgba(14,12,11,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Mobile Menu Toggle & Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="admin-mobile-toggle"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '1rem' }}
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: "var(--font-body)", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>›</span>
              <span style={{ color: '#E27D60', fontSize: '0.75rem', fontFamily: "var(--font-body)", textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                {currentNavItem?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* User Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontFamily: "var(--font-body)" }}>
              {user.name || user.email}
            </span>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, #E27D60, #D4A96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(226,125,96,0.3)' }}>
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
