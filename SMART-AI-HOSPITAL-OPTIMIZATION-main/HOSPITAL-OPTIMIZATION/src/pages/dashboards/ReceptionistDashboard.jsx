import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { receptionistService, publicService } from '../../services/api';
import { UserPlus, Calendar, Clock, Stethoscope, Receipt, Users, CheckCircle, Plus, X, Sparkles, RefreshCw } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [data, setData] = useState({
    opdRegistrationsToday: 42,
    activeTokensGenerated: 38,
    doctorsAvailable: 12,
    pendingBillingInvoices: 5
  });

  const [queue, setQueue] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [feedback, setFeedback] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: 30,
    gender: 'Male',
    department: 'General Medicine',
    doctorId: '',
    rawComplaint: '',
    severity: 'Normal'
  });

  const loadData = () => {
    receptionistService.getDashboard()
      .then(res => { if (res.data?.data) setData(res.data.data); })
      .catch(err => console.log('Receptionist API error:', err));

    receptionistService.getQueue()
      .then(res => { if (res.data?.data) setQueue(res.data.data); })
      .catch(err => console.log('Receptionist Queue API error:', err));

    publicService.getDepartments()
      .then(res => { if (res.data?.data) setDepartments(res.data.data); })
      .catch(err => console.log('Dept fetch error:', err));

    publicService.getDoctors()
      .then(res => { if (res.data?.data) setDoctors(res.data.data); })
      .catch(err => console.log('Doctors fetch error:', err));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterWalkin = async (e) => {
    e.preventDefault();
    try {
      const selectedDoc = doctors.find(d => d.id === formData.doctorId);
      const payload = {
        ...formData,
        doctorName: selectedDoc?.name || 'Dr. On Duty',
        cabin: selectedDoc?.cabin || selectedDoc?.roomNumber || 'Cabin 101'
      };

      const res = await receptionistService.registerWalkin(payload);
      if (res.data?.data) {
        const token = res.data.data.tokenNumber;
        setFeedback(`Walk-in registered successfully! Issued Token: ${token}`);
      } else {
        setFeedback('Walk-in patient registered successfully!');
      }
      setShowModal(false);
      setFormData({
        name: '',
        phone: '',
        age: 30,
        gender: 'Male',
        department: 'General Medicine',
        doctorId: '',
        rawComplaint: '',
        severity: 'Normal'
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register walk-in patient');
    }
  };

  return (
    <div>
      <Navbar title="Receptionist Front Desk Hub" />
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
            <CheckCircle size={18} color="var(--accent-mint)" />
            <span>{feedback}</span>
          </div>
        )}
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>OPD Registrations</span>
              <UserPlus size={20} color="#D97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{data.opdRegistrationsToday}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Walk-in & SmartCare Kiosk Today</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tokens Issued</span>
              <Clock size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{data.activeTokensGenerated}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Queue Dispensed</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>On-Duty Doctors</span>
              <Stethoscope size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{data.doctorsAvailable}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across 8 Departments</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Invoices</span>
              <Receipt size={20} color="var(--accent-rose)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{data.pendingBillingInvoices}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting Counter Payment</div>
          </div>

        </div>

        {/* Quick Action Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <UserPlus color="#D97706" size={20} />
              <span>OPD Patient Registration & Token Dispenser</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Register new walk-in patients, allocate doctor appointments, and issue department queue tokens.
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Issue New Token / Register Walk-in
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <Receipt color="var(--primary)" size={20} />
              <span>Billing & Checkout Counter</span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Generate invoices for doctor consultations, lab tests, and hospital medicine dispensaries.
            </p>
            <button className="btn-secondary" onClick={() => alert("Billing Counter opened: All active token invoices ready for checkout.")}>
              Open Billing Counter
            </button>
          </div>

        </div>

        {/* Live Queue Table */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <Clock size={20} color="var(--primary)" />
              <span>Today's Issued Tokens & Live OPD Status</span>
            </h3>
            <button className="btn-secondary" onClick={loadData} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.85rem 0.75rem' }}>Token</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Department</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Assigned Doctor</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Cabin</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No queue tokens active yet.
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr key={item.id || item.tokenNumber} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{item.tokenNumber}</td>
                    <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>{item.patientName}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>{item.department}</td>
                    <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{item.doctorName}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>{item.cabin}</td>
                    <td style={{ padding: '0.85rem 0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: item.status === 'IN_CONSULTATION' ? 'var(--accent-mint-soft)' : item.status === 'COMPLETED' ? 'var(--accent-mint-soft)' : 'var(--accent-amber-soft)',
                        color: item.status === 'IN_CONSULTATION' || item.status === 'COMPLETED' ? 'var(--primary)' : '#D97706',
                        border: item.status === 'IN_CONSULTATION' || item.status === 'COMPLETED' ? '1px solid #C1E8DD' : '1px solid #F8D8A7'
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Walk-in Registration Modal */}
        {showModal && (
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
            <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                  <UserPlus size={22} color="#D97706" />
                  <span>Register Walk-in Patient</span>
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRegisterWalkin}>
                <div className="form-group">
                  <label>Patient Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      className="form-control"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Doctor</label>
                    <select
                      className="form-control"
                      value={formData.doctorId}
                      onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    >
                      <option value="">Auto-Match Shortest Queue</option>
                      {doctors.filter(d => !formData.department || d.department === formData.department).map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.cabin || d.roomNumber || 'OPD'})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Chief Complaint / Symptoms</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Describe main symptoms..."
                    value={formData.rawComplaint}
                    onChange={(e) => setFormData({ ...formData, rawComplaint: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Generate Token & Assign
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
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

export default ReceptionistDashboard;
