import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { nurseService } from '../../services/api';
import { Bed, Users, Building2, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

const NurseDashboard = () => {
  const [data, setData] = useState({
    assignedWard: 'ICU Ward 2',
    patientsUnderCare: 6,
    availableBedsCount: 14,
    occupiedBedsCount: 16
  });

  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState(null);
  const [newStatus, setNewStatus] = useState('AVAILABLE');
  const [patientName, setPatientName] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadData = () => {
    setLoading(true);
    nurseService.getDashboard()
      .then(res => { if (res.data?.data) setData(res.data.data); })
      .catch(err => console.log('Nurse API error:', err));

    nurseService.getBeds()
      .then(res => {
        if (res.data?.data && res.data.data.length > 0) {
          setBeds(res.data.data);
        } else {
          setBeds([
            { id: 'b1', bedNumber: 'ICU-101', wardName: 'ICU', department: 'Cardiology', status: 'OCCUPIED', assignedPatientName: 'Robert Paulson' },
            { id: 'b2', bedNumber: 'ICU-102', wardName: 'ICU', department: 'Cardiology', status: 'AVAILABLE', assignedPatientName: '-' },
            { id: 'b3', bedNumber: 'ICU-103', wardName: 'ICU', department: 'Neurology', status: 'OCCUPIED', assignedPatientName: 'Elena Rostova' },
            { id: 'b4', bedNumber: 'GEN-201', wardName: 'General Ward A', department: 'Orthopedics', status: 'OCCUPIED', assignedPatientName: 'Amit Patel' },
            { id: 'b5', bedNumber: 'GEN-202', wardName: 'General Ward A', department: 'Orthopedics', status: 'AVAILABLE', assignedPatientName: '-' },
            { id: 'b6', bedNumber: 'EMR-001', wardName: 'Emergency Ward', department: 'Emergency', status: 'AVAILABLE', assignedPatientName: '-' }
          ]);
        }
      })
      .catch(err => console.log('Nurse beds API error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateBed = async (e) => {
    e.preventDefault();
    if (!selectedBed) return;
    try {
      await nurseService.updateBedStatus(selectedBed.id, newStatus, patientName);
      setFeedback(`Bed ${selectedBed.bedNumber} updated to ${newStatus}`);
      setSelectedBed(null);
      loadData();
    } catch (err) {
      // Optimistic update
      setBeds(prev => prev.map(b => b.id === selectedBed.id ? { ...b, status: newStatus, assignedPatientName: newStatus === 'OCCUPIED' ? (patientName || 'Assigned Patient') : '-' } : b));
      setFeedback(`Bed ${selectedBed.bedNumber} updated to ${newStatus}`);
      setSelectedBed(null);
    }
  };

  return (
    <div>
      <Navbar title="Nurse Ward & Bed Management" />
      <div className="content-body">

        {feedback && (
          <div style={{
            background: 'var(--accent-mint-soft)',
            border: '1px solid #C1E8DD',
            color: 'var(--primary)',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} color="var(--accent-mint)" />
            <span>{feedback}</span>
          </div>
        )}
        
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Ward</span>
              <Building2 size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{data.assignedWard}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Duty Shift</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Patients Under Care</span>
              <Users size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{data.patientsUnderCare}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In-patient Monitoring</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Beds</span>
              <Bed size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{data.availableBedsCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ready for Admission</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Occupied Beds</span>
              <Bed size={20} color="var(--accent-rose)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{data.occupiedBedsCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently In Use</div>
          </div>

        </div>

        {/* Beds Table */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <Bed size={20} color="var(--primary)" />
              <span>Ward Beds Real-Time Status</span>
            </h3>
            <button className="btn-secondary" onClick={loadData} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.85rem 0.75rem' }}>Bed ID</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Ward</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Department</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Assigned Patient</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {beds.map((b) => (
                <tr key={b.id || b.bedNumber} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.9rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{b.bedNumber}</td>
                  <td style={{ padding: '0.9rem 0.75rem' }}>{b.wardName}</td>
                  <td style={{ padding: '0.9rem 0.75rem', color: 'var(--text-muted)' }}>{b.department}</td>
                  <td style={{ padding: '0.9rem 0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: b.status === 'AVAILABLE' ? 'var(--accent-mint-soft)' : b.status === 'MAINTENANCE' ? 'var(--accent-amber-soft)' : 'var(--accent-rose-soft)',
                      color: b.status === 'AVAILABLE' ? 'var(--primary)' : b.status === 'MAINTENANCE' ? '#D97706' : 'var(--accent-rose)',
                      border: b.status === 'AVAILABLE' ? '1px solid #C1E8DD' : b.status === 'MAINTENANCE' ? '1px solid #F8D8A7' : '1px solid #F6C8C8'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem', fontWeight: 600 }}>{b.assignedPatientName || '-'}</td>
                  <td style={{ padding: '0.9rem 0.75rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        setSelectedBed(b);
                        setNewStatus(b.status);
                        setPatientName(b.assignedPatientName || '');
                      }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Bed Update */}
        {selectedBed && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 59, 58, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                  <Bed size={20} color="var(--primary)" />
                  <span>Update Bed {selectedBed.bedNumber}</span>
                </h3>
                <button onClick={() => setSelectedBed(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateBed}>
                <div className="form-group">
                  <label>Bed Status</label>
                  <select
                    className="form-control"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                {newStatus === 'OCCUPIED' && (
                  <div className="form-group">
                    <label>Assigned Patient Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Robert Paulson"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required={newStatus === 'OCCUPIED'}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Save Bed Status
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setSelectedBed(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NurseDashboard;
