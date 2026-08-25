import { useEffect, useState } from 'react';
import api from '../../services/api';

export function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact');
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch contact messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
          Contact Messages
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
          View inquiries and messages submitted via the website contact form.
        </p>
      </div>

      {/* Messages Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Date', 'Sender Name', 'Email', 'Message Snippet', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontFamily: "var(--font-body)", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No contact messages received
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600 }}>{m.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#E27D60' }}>{m.email}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.7)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.message}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <button
                        onClick={() => handleDelete(m.id)}
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
