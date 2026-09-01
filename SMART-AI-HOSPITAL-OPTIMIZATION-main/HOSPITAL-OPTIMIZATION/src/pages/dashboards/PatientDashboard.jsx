import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { Calendar, Clock, MapPin, Bot, Heart, AlertCircle, Sparkles, Activity } from 'lucide-react';

const PatientDashboard = () => {
  const [data, setData] = useState({
    upcomingAppointments: 1,
    currentQueueToken: 'PAT-104',
    estimatedWaitTimeMinutes: 15,
    assignedDoctor: 'Dr. Sarah Jenkins',
    department: 'Cardiology'
  });

  useEffect(() => {
    api.get('/patient/dashboard')
      .then(res => {
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      })
      .catch(err => console.log('Patient API fetch info:', err));
  }, []);

  return (
    <div>
      <Navbar title="SmartCare Patient Portal" />
      <div className="content-body">
        
        {/* Welcome Banner */}
        <div className="glass-card" style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'var(--accent-mint-soft)',
          border: '1px solid #C1E8DD'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>Welcome to SmartCare Patient Hub</h2>
          <p style={{ color: '#5C6864', fontSize: '0.92rem', margin: 0 }}>
            Track your live token position, review upcoming doctor consultations, and explore hospital navigation maps.
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Queue Token</span>
              <Clock size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{data.currentQueueToken}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Department: {data.department}</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Est. Waiting Time</span>
              <Sparkles size={20} color="#D97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{data.estimatedWaitTimeMinutes} mins</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>AI Estimated based on current OPD flow</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Doctor</span>
              <Heart size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{data.assignedDoctor}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Cabin OPD-302</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming Appointments</span>
              <Calendar size={20} color="#7C3AED" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED' }}>{data.upcomingAppointments}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Confirmed Consultation</div>
          </div>

        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <Bot color="var(--primary)" size={20} />
              <span>AI Hospital Assistant</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Ask intelligent questions regarding doctor specializations, OPD working hours, lab report availability, or indoor directions.
            </p>
            <button className="btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => alert("Opening AI Assistant chat window...")}>
              Launch AI Assistant
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <MapPin color="var(--primary)" size={20} />
              <span>Hospital Floor Map & Navigation</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Interactive floor maps with shortest pathway navigation from Front Reception to OPD rooms, Radiology, and Pharmacy.
            </p>
            <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => alert("Loading floor map navigation...")}>
              Open Hospital Map
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
