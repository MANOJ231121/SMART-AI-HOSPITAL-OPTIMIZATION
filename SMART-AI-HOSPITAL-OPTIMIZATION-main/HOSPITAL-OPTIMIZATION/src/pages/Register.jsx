import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import SmartCareLogo from '../components/SmartCareLogo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await registerPatient(formData);
    setLoading(false);

    if (result.success) {
      navigate('/patient/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F7F4',
      padding: '2.5rem 1.5rem',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <SmartCareLogo size={56} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F3B3A', letterSpacing: '-0.02em' }}>
            SmartCare Patient Registration
          </h1>
          <p style={{ color: '#5C6864', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Create your personal medical profile for appointments and digital queuing
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem', background: '#FFFFFF' }}>
          
          <div style={{
            background: '#E4F5F0',
            border: '1px solid #C1E8DD',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.82rem',
            color: '#0F3B3A',
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} color="#0F3B3A" />
            <span>Registration automatically assigns PATIENT role authority. Staff accounts require Admin creation.</span>
          </div>

          {error && (
            <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} id="form-register">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">Phone Number *</label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="+1 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-dob">Date of Birth</label>
                <input
                  id="reg-dob"
                  name="dateOfBirth"
                  type="date"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-gender">Gender</label>
                <select
                  id="reg-gender"
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-emergency">Emergency Contact</label>
                <input
                  id="reg-emergency"
                  name="emergencyContact"
                  type="text"
                  className="form-control"
                  placeholder="Name & Phone"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="reg-address">Residential Address</label>
              <input
                id="reg-address"
                name="address"
                type="text"
                className="form-control"
                placeholder="Street address, City, State"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="reg-password">Password *</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirmPassword">Confirm Password *</label>
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-register-submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Registering Account...' : 'Complete Patient Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#5C6864' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#0F3B3A', fontWeight: 700, textDecoration: 'none' }}>
              Sign in to SmartCare Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
