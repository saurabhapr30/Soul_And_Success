import { useState } from 'react';
import { SEOHead } from '@/components/ui';
import { authService } from '@/services/authService';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      await authService.forgotPassword(email);
      setStatus('success');
      setMessage('If an account exists, a password reset link has been sent to your email.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <SEOHead title="Forgot Password | Soul And Success" description="Reset your Soul And Success password." />
      <div style={{ padding: '120px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--color-warm-ivory)' }}>
        <div style={{ maxWidth: '500px', width: '100%', backgroundColor: 'var(--color-soft-white)', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-deep-espresso)', marginBottom: '20px', textAlign: 'center' }}>Forgot Password</h1>
          
          <p style={{ color: 'var(--color-warm-brown)', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
            Enter your email address below and we'll send you a link to reset your password.
          </p>

          {status === 'success' ? (
            <div style={{ color: '#388e3c', padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '4px', textAlign: 'center' }}>
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
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
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
