import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { authService } from '@/services/authService';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); // if needed, some reset flows require it in URL, let's assume our backend requires email & token

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Let's assume the email is also passed in the URL, or we prompt for it
  const [userEmail, setUserEmail] = useState(email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
       setStatus('error');
       setMessage('Invalid or missing reset token.');
       return;
    }
    if (!userEmail) {
       setStatus('error');
       setMessage('Please enter your email address to confirm.');
       return;
    }
    if (password !== confirmPassword) {
       setStatus('error');
       setMessage('Passwords do not match.');
       return;
    }
    if (password.length < 6) {
       setStatus('error');
       setMessage('Password must be at least 6 characters.');
       return;
    }
    
    setStatus('loading');
    setMessage('');
    
    try {
      await authService.resetPassword({ email: userEmail, token, newPassword: password });
      setStatus('success');
      setMessage('Your password has been successfully reset.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to reset password. The token may have expired.');
    }
  };

  return (
    <>
      <SEOHead title="Reset Password | Soul And Success" description="Reset your password." />
      <div style={{ padding: '120px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--color-warm-ivory)' }}>
        <div style={{ maxWidth: '500px', width: '100%', backgroundColor: 'var(--color-soft-white)', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-deep-espresso)', marginBottom: '20px', textAlign: 'center' }}>Reset Password</h1>
          
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#388e3c', padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '4px', marginBottom: '30px' }}>
                {message}
              </div>
              <Link to="/login" style={{ display: 'inline-block', backgroundColor: 'var(--color-warm-bronze)', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!email && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>Confirm Email Address</label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>New Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              
              {status === 'error' && (
                <div style={{ color: '#d32f2f', fontSize: '14px' }}>{message}</div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                style={{ backgroundColor: 'var(--color-warm-bronze)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
