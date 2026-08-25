import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatINR } from '../../utils/helpers';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PAID: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
  DELIVERED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
  PROCESSING: { bg: 'rgba(212,169,106,0.15)', color: '#D4A96A' },
  SHIPPED: { bg: 'rgba(61,139,139,0.15)', color: '#3D8B8B' },
  PENDING: { bg: 'rgba(255,183,77,0.15)', color: '#FFB74D' },
  FAILED: { bg: 'rgba(229,115,115,0.15)', color: '#E57373' },
  CANCELLED: { bg: 'rgba(150,150,150,0.15)', color: '#999' },
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    ebooks: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordRes, bookRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/books').catch(() => ({ data: { data: [] } }))
        ]);
        
        const orders = ordRes.data?.data || [];
        const products = prodRes.data?.data || [];
        const ebooks = bookRes.data?.data || [];

        const revenue = orders.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);

        setStats({
          products: products.length,
          orders: orders.length,
          ebooks: ebooks.length,
          revenue
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    const quickLinks = [
    { label: 'Courses', to: '/admin/courses', icon: '▶' },
    { label: 'E-Book', to: '/admin/books', icon: '📚' },
    { label: 'Merchandise', to: '/admin/merchandise', icon: '🛍️' },
    { label: 'FAQ', to: '/admin/faq', icon: '❓' },
  ];

  const kpis = [
    { label: 'TOTAL REVENUE', value: formatINR(stats.revenue), icon: '💰', to: '/admin/orders', change: 'Lifetime Total' },
    { label: 'TOTAL ORDERS', value: `${stats.orders}`, icon: '📦', to: '/admin/orders', change: 'All Orders' },
    { label: 'MERCHANDISE', value: `${stats.products}`, icon: '🛍️', to: '/admin/merchandise', change: 'Active Items' },
    { label: 'BOOKS & COURSES', value: `${stats.ebooks}`, icon: '📚', to: '/admin/books', change: 'Digital Assets' },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "var(--font-display-secondary)", fontSize: '2rem', color: '#fff', margin: 0, fontWeight: 700 }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0.4rem 0 0', fontSize: '0.85rem' }}>
          Welcome back to the Soul & Success Control Center.
        </p>
      </div>

      {/* Quick Actions Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.5rem',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: "var(--font-body)",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: '#E27D60', fontSize: '0.85rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.to} style={{ textDecoration: 'none' }}>
            <div
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.75rem', transition: 'all 0.2s ease', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{kpi.icon}</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.5rem' }}>
                {kpi.label}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem', lineHeight: 1 }}>
                {kpi.value}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: 0 }}>{kpi.change}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: '1rem', color: '#fff', margin: 0 }}>
            Recent Orders
          </h2>
          <Link to="/admin/orders" style={{ fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E27D60', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Status', 'Total Amount', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontFamily: "var(--font-body)", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No orders recorded yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusKey = order.orderStatus || order.paymentStatus || 'PENDING';
                  const sc = STATUS_COLORS[statusKey] || STATUS_COLORS['PENDING'];
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '1rem 0.75rem', color: '#E27D60', fontWeight: 600, whiteSpace: 'nowrap' }}>#{order.id.slice(-6)}</td>
                      <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{order.user?.name || order.shippingAddress?.fullName || 'Guest Customer'}</td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '100px', padding: '0.2rem 0.75rem', fontSize: '0.7rem', fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                          {statusKey}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {formatINR(order.total || 0)}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
