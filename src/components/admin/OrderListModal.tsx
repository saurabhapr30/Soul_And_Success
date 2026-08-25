import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR } from '../../utils/helpers';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    paymentStatus: string;
    orderStatus: string;
    total: number;
    createdAt: string;
    user?: { name: string; email: string; phone?: string } | null;
  };
}

interface OrderListModalProps {
  entityId: string;
  entityTitle: string;
  entityType: 'product' | 'book';
  onClose: () => void;
}

export function OrderListModal({ entityId, entityTitle, entityType, onClose }: OrderListModalProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = entityType === 'book' ? `/books/${entityId}/orders` : `/products/${entityId}/orders`;
    api.get(endpoint)
      .then(res => setOrders(res.data?.data || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [entityId, entityType]);

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    PAID: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
    DELIVERED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
    CONFIRMED: { bg: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
    PROCESSING: { bg: 'rgba(212,169,106,0.15)', color: '#D4A96A' },
    SHIPPED: { bg: 'rgba(61,139,139,0.15)', color: '#3D8B8B' },
    PENDING: { bg: 'rgba(255,183,77,0.15)', color: '#FFB74D' },
    FAILED: { bg: 'rgba(229,115,115,0.15)', color: '#E57373' },
    CANCELLED: { bg: 'rgba(150,150,150,0.15)', color: '#999' },
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    padding: '1.5rem 1rem',
  };
  const modalStyle: React.CSSProperties = {
    background: '#100d0a',
    border: '1px solid rgba(226,125,96,0.22)',
    borderRadius: '1.25rem',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 40px 80px rgba(0,0,0,0.85)',
    overflow: 'hidden',
  };
  const headerStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.5rem 1.75rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  };
  const bodyStyle: React.CSSProperties = {
    flex: '1 1 0%', minHeight: 0,
    overflowY: 'auto', overflowX: 'hidden',
    padding: '1.25rem 1.75rem 2rem',
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E27D60', margin: '0 0 0.3rem' }}>
              ORDERS
            </p>
            <h2 style={{ fontFamily: 'var(--font-display-secondary)', fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 700 }}>
              {entityTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={bodyStyle}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem 0' }}>Loading orders...</p>
          ) : error ? (
            <p style={{ color: '#E57373', textAlign: 'center', padding: '2rem 0' }}>{error}</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic' }}>No orders yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    {['Order #', 'Customer', 'Qty', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(item => {
                    const statusKey = item.order?.paymentStatus || item.order?.orderStatus || 'PENDING';
                    const sc = STATUS_COLORS[statusKey] || STATUS_COLORS['PENDING'];
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#E27D60', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          #{item.order?.orderNumber?.slice(-6) || item.order?.id?.slice(-6) || '—'}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                          {item.order?.user?.name || 'Guest'}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.6)' }}>{item.quantity}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {formatINR(item.total || 0)}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span style={{ background: sc.bg, color: sc.color, borderRadius: 100, padding: '0.15rem 0.65rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                            {statusKey}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
