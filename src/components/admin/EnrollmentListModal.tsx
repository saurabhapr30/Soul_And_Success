import { useEffect, useState } from 'react';
import api from '../../services/api';

interface Enrollment {
  id: string;
  enrolledAt: string;
  status: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    addresses?: Array<{ addressLine1: string; city: string; state: string; country: string; postalCode: string }>;
  };
}

interface EnrollmentListModalProps {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
}

export function EnrollmentListModal({ courseId, courseTitle, onClose }: EnrollmentListModalProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/courses/${courseId}/enrollments`)
      .then(res => setEnrollments(res.data?.data || []))
      .catch(() => setError('Failed to load enrollments'))
      .finally(() => setLoading(false));
  }, [courseId]);

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
    maxWidth: '800px',
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
              ENROLLMENTS
            </p>
            <h2 style={{ fontFamily: 'var(--font-display-secondary)', fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 700 }}>
              {courseTitle}
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
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem 0' }}>Loading enrollments...</p>
          ) : error ? (
            <p style={{ color: '#E57373', textAlign: 'center', padding: '2rem 0' }}>{error}</p>
          ) : enrollments.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic' }}>No enrollments yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Phone', 'Address', 'Enrolled At', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(enr => (
                    <tr key={enr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.85rem 0.75rem', color: '#fff', fontWeight: 500 }}>{enr.user?.name || '—'}</td>
                      <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.6)' }}>{enr.user?.email || '—'}</td>
                      <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.6)' }}>{enr.user?.phone || '—'}</td>
                      <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.6)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {enr.user?.addresses?.[0] ? `${enr.user.addresses[0].addressLine1}, ${enr.user.addresses[0].city}` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(enr.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span style={{ background: enr.status === 'ACTIVE' ? 'rgba(76,175,80,0.15)' : 'rgba(255,183,77,0.15)', color: enr.status === 'ACTIVE' ? '#4CAF50' : '#FFB74D', borderRadius: 100, padding: '0.15rem 0.65rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                          {enr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
