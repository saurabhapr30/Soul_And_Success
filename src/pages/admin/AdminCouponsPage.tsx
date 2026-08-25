import { useEffect, useState } from 'react';
import api from '../../services/api';

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    description: '',
    minimumOrderValue: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ code: '', type: 'PERCENTAGE', value: '', description: '', minimumOrderValue: '' });
    setShowModal(true);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value || '0'),
        description: formData.description,
        ...(formData.minimumOrderValue ? { minimumOrderValue: parseFloat(formData.minimumOrderValue) } : {}),
      };

      await api.post('/coupons', payload);
      setShowModal(false);
      await fetchCoupons();
    } catch (err: any) {
      console.error('Failed to create coupon', err);
      const msg = err.response?.data?.message || err.message || 'Failed to create coupon';
      alert(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert('Failed to delete coupon');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display-secondary)", fontWeight: 700, fontSize: '2rem', color: '#fff', margin: '0 0 0.5rem' }}>
            Discount Coupons
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', margin: 0 }}>
            Manage promotional discount codes, percentage vouchers, and active campaigns.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          style={{
            background: 'linear-gradient(135deg, #E27D60, #D4A96A)',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '0.75rem 1.75rem',
            fontFamily: "var(--font-body)",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(226,125,96,0.3)',
          }}
        >
          + Add New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {['Code', 'Type', 'Value', 'Status', 'Actions'].map((h) => (
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
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                    No active coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 0.75rem', color: '#E27D60', fontWeight: 700, fontFamily: 'monospace' }}>{c.code}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.7)' }}>{c.type}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#fff', fontWeight: 600 }}>
                      {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${Number(c.value).toFixed(2)} OFF`}
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '100px', 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        background: c.isActive ? 'rgba(76,175,80,0.15)' : 'rgba(229,115,115,0.15)',
                        color: c.isActive ? '#4CAF50' : '#E57373'
                      }}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <button
                        onClick={() => handleDelete(c.id)}
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

      {/* Modal for Creating New Coupon */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#1a1310', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '450px', color: '#fff' }}>
            <h2 style={{ fontFamily: "var(--font-display-secondary)", fontSize: '1.5rem', marginBottom: '1.5rem', color: '#E27D60' }}>
              Create New Coupon
            </h2>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontFamily: "var(--font-body)" }}>Coupon Code</label>
                <input required type="text" placeholder="e.g. WELCOME10" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} style={{ width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', textTransform: 'uppercase', fontFamily: 'monospace' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontFamily: "var(--font-body)" }}>Discount Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.65rem', background: '#251b17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontFamily: "var(--font-body)" }}>Discount Value</label>
                  <input required type="number" step="0.01" placeholder={formData.type === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 200'} value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} style={{ width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontFamily: "var(--font-body)" }}>Minimum Order Value (₹, optional)</label>
                <input type="number" step="0.01" placeholder="e.g. 999" value={formData.minimumOrderValue} onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })} style={{ width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontFamily: "var(--font-body)" }}>Description</label>
                <input type="text" placeholder="e.g. 15% discount on all wellness orders" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '6px', padding: '0.6rem 1.25rem', cursor: 'pointer' }}>Cancel</button>
                <button disabled={saving} type="submit" style={{ background: 'linear-gradient(135deg, #E27D60, #D4A96A)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.6rem 1.25rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {saving ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
