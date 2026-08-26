import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight, KeyRound, Sparkles, Activity } from 'lucide-react';
import SmartCareLogo from '../components/SmartCareLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both Email and Password.');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      switch (result.role) {
        case 'PATIENT':
          navigate('/patient/dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor/dashboard');
          break;
        case 'NURSE':
          navigate('/nurse/dashboard');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      setError(result.message);
    }
  };

  const fillQuickDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F4',
        padding: '2rem 1.5rem',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Header Logo - SmartCare Official Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <SmartCareLogo size={58} />
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0F3B3A',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}
          >
            SmartCare
          </h1>

          <p
            style={{
              color: '#5C6864',
              fontSize: '0.92rem',
              marginTop: '0.35rem',
              fontWeight: 500
            }}
          >
            Hospital & Clinical Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card" style={{ padding: '2.25rem', background: '#FFFFFF' }}>

          <div
            style={{
              background: '#E4F5F0',
              border: '1px solid #C1E8DD',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.82rem',
              color: '#0F3B3A',
              fontWeight: 600
            }}
          >
            <Lock size={16} color="#0F3B3A" />
            <span>
              Role authorization is determined strictly by the backend server.
            </span>
          </div>

          {error && (
            <div
              className="alert-error"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} id="form-login">

            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">
                Email Address / Username
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />

                <Mail
                  size={18}
                  color="#8C9995"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <label htmlFor="login-password">Password</label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Password reset instructions have been logged. Please contact your system administrator.'
                    );
                  }}
                  style={{
                    fontSize: '0.8rem',
                    color: '#0F3B3A',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />

                <KeyRound
                  size={18}
                  color="#8C9995"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              id="btn-login-submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                marginTop: '1rem',
                fontSize: '0.95rem'
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Accounts */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              Quick Demo Accounts (Click to Autofill):
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.45rem',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={() => fillQuickDemoCredentials('admin@hospital.com', 'Admin@123')}
                className="role-badge ADMIN"
                style={{ cursor: 'pointer' }}
              >
                ADMIN
              </button>

              <button
                onClick={() => fillQuickDemoCredentials('doctor@hospital.com', 'Doctor@123')}
                className="role-badge DOCTOR"
                style={{ cursor: 'pointer' }}
              >
                DOCTOR
              </button>

              <button
                onClick={() => fillQuickDemoCredentials('nurse@hospital.com', 'Nurse@123')}
                className="role-badge NURSE"
                style={{ cursor: 'pointer' }}
              >
                NURSE
              </button>

              <button
                onClick={() => fillQuickDemoCredentials('receptionist@hospital.com', 'Receptionist@123')}
                className="role-badge RECEPTIONIST"
                style={{ cursor: 'pointer' }}
              >
                RECEPTIONIST
              </button>

              <button
                onClick={() => fillQuickDemoCredentials('patient@hospital.com', 'Patient@123')}
                className="role-badge PATIENT"
                style={{ cursor: 'pointer' }}
              >
                PATIENT
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;