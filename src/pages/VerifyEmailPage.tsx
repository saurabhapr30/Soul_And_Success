import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { authService } from '@/services/authService';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Missing token or email.');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(email, token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };
    verify();
  }, [token, email]);

  const handleResend = async () => {
    if (!email) return;
    setStatus('loading');
    setMessage('Sending new verification link...');
    try {
      await authService.resendVerification(email);
      setStatus('error'); // keep it on error screen but update message
      setMessage('A new verification link has been sent to your email.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to resend verification link.');
    }
  };

  return (
    <>
      <SEOHead title="Verify Email | Soul And Success" description="Verify your email address." />
      <div style={{ padding: '120px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--color-warm-ivory)' }}>
        <div style={{ maxWidth: '500px', backgroundColor: 'var(--color-soft-white)', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-deep-espresso)', marginBottom: '20px' }}>Email Verification</h1>
          
          <div style={{ fontSize: '16px', color: 'var(--color-warm-brown)', marginBottom: '30px' }}>
            {message}
          </div>
          
          {status === 'success' && (
            <Link to="/login" style={{ display: 'inline-block', backgroundColor: 'var(--color-warm-bronze)', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
              Go to Login
            </Link>
          )}

          {status === 'error' && email && (
             <div style={{ marginTop: '20px' }}>
               <button onClick={handleResend} style={{ backgroundColor: 'transparent', border: '1px solid var(--color-warm-bronze)', color: 'var(--color-warm-bronze)', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                 Resend Verification Link
               </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
}
