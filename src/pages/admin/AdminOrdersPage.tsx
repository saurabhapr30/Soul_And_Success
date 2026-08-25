import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PAID: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
  CONFIRMED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
  DELIVERED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
  PROCESSING: { bg: 'rgba(212,169,106,0.15)', color: '#D4A96A' },
  SHIPPED: { bg: 'rgba(61,139,139,0.15)', color: '#3D8B8B' },
  PENDING: { bg: 'rgba(255,183,77,0.15)', color: '#FFB74D' },
  FAILED: { bg: 'rgba(229,115,115,0.15)', color: '#E57373' },
  CANCELLED: { bg: 'rgba(150,150,150,0.15)', color: '#999' },
};

type CategoryFilter = 'ALL' | 'PAID' | 'PENDING' | 'CANCELLED';

const CATEGORY_BUTTONS: { label: string; value: CategoryFilter; icon: string }[] = [
  { label: 'All Orders', value: 'ALL', icon: '📋' },
  { label: 'Confirmed / Paid', value: 'PAID', icon: '✅' },
  { label: 'Pending', value: 'PENDING', icon: '⏳' },
  { label: 'Cancelled / Failed', value: 'CANCELLED', icon: '❌' },
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, orderStatus: string) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/orders/${orderId}`, { orderStatus });
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'PAID') return ['PAID', 'CONFIRMED', 'DELIVERED', 'SHIPPED'].includes(order.orderStatus || order.paymentStatus);
    if (activeCategory === 'PENDING') return ['PENDING', 'PROCESSING'].includes(order.orderStatus || order.paymentStatus);
    if (activeCategory === 'CANCELLED') return ['CANCELLED', 'FAILED', 'REFUNDED'].includes(order.orderStatus || order.paymentStatus);
    return true;
  });




  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
          Orders
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
          Complete order history and status management.
        </p>
      </div>


      {/* Category Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATEGORY_BUTTONS.map((btn) => {
          const isActive = activeCategory === btn.value;
          return (
            <button
              key={btn.value}
              onClick={() => setActiveCategory(btn.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '100px',
                border: isActive ? '1px solid rgba(226,125,96,0.4)' : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? 'linear-gradient(135deg, rgba(226,125,96,0.2), rgba(212,169,106,0.1))' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily: "var(--font-body)",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{btn.icon}</span>
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Items', 'Status', 'Total', 'Action'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading order list...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No orders found matching filter
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusKey = order.orderStatus || order.paymentStatus || 'PENDING';
                  const sc = STATUS_COLORS[statusKey] || STATUS_COLORS['PENDING'];
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '1rem 0.75rem', color: '#E27D60', fontWeight: 600 }}>#{order.id.slice(-6)}</td>
                      <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.8)' }}>
                        <div>{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{order.user?.email || order.shippingAddress?.email || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                        {order.items?.length || 0} item(s)
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '100px', padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: '0.1em' }}>
                          {statusKey}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600 }}>
                        ₹{Number(order.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <select
                          value={statusKey}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          style={{ background: '#1a1310', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
