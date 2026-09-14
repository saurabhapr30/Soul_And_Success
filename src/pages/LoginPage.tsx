import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { authService } from '@/services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      await authService.login({ email, password });
      setStatus('idle');
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <>
      <SEOHead title="Sign In | Soul And Success" description="Sign in to your Soul And Success account." />
      <div style={{ padding: '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-warm-ivory)', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '450px', width: '100%', backgroundColor: 'var(--color-soft-white)', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-deep-espresso)', marginBottom: '24px', textAlign: 'center' }}>Sign In</h1>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ color: 'var(--color-deep-espresso)', fontWeight: 'bold' }}>Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--color-warm-bronze)', fontSize: '14px', textDecoration: 'none' }}>Forgot?</Link>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            {status === 'error' && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px 14px', borderRadius: '4px', fontSize: '14px' }}>
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              style={{ backgroundColor: 'var(--color-warm-bronze)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
