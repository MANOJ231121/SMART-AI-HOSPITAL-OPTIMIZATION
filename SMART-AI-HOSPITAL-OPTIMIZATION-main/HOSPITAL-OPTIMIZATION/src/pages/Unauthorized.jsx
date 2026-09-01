import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, ArrowLeft, LayoutDashboard } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoDashboard = () => {
    switch (role) {
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
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F7F4',
      padding: '2rem',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2rem', background: '#FFFFFF' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'var(--accent-rose-soft)',
          border: '1px solid #F6C8C8',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--accent-rose)'
        }}>
          <ShieldX size={36} />
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F3B3A', marginBottom: '0.5rem' }}>
          Access Denied
        </h1>

        <p style={{ color: '#5C6864', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          You do not have permission to access this page. This module requires explicit authorization privileges for your role (<strong style={{ color: 'var(--accent-rose)' }}>{role || 'UNAUTHENTICATED'}</strong>).
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            id="btn-unauthorized-back"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <button
            onClick={handleGoDashboard}
            className="btn-primary"
            id="btn-unauthorized-dashboard"
          >
            <LayoutDashboard size={18} />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
