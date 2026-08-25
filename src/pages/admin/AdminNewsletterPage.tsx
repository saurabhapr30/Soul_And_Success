import { useEffect, useState } from 'react';
import api from '../../services/api';

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/newsletter');
      setSubscribers(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete subscriber');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
          Newsletter Subscribers
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
          Manage email list subscribers and newsletter signups.
        </p>
      </div>

      {/* Subscribers Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Subscribed Date', 'Email Address', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No newsletter subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#E27D60', fontWeight: 600 }}>{s.email}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '100px', 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        background: s.isActive ? 'rgba(76,175,80,0.15)' : 'rgba(229,115,115,0.15)',
                        color: s.isActive ? '#4CAF50' : '#E57373'
                      }}>
                        {s.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <button
                        onClick={() => handleDelete(s.id)}
                        style={{ background: 'rgba(229,115,115,0.15)', color: '#E57373', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
