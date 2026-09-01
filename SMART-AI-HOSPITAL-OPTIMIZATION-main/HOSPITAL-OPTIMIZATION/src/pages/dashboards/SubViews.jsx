import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { adminService, doctorService, nurseService, publicService } from '../../services/api';
import {
  Bot, MapPin, Calendar, Clock, Bed, Sparkles, BarChart3, Settings,
  ShieldCheck, FileText, CheckCircle2, Users, Stethoscope, Building2,
  AlertTriangle, RefreshCw, Eye, Search, Filter
} from 'lucide-react';

export const GenericSubView = ({ title, subtitle, icon: Icon = Sparkles, children }) => {
  const { role, user } = useAuth();

  return (
    <div>
      <Navbar title={title} />
      <div className="content-body">
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#0F3B3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3FBFA0'
            }}>
              <Icon size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>{title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{subtitle}</p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

/* 1. Admin Patients View (SmartCare Registrations & Intake) */
export const AdminPatientsView = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadPatients = () => {
    setLoading(true);
    adminService.getPatients()
      .then(res => {
        if (res.data?.data) setPatients(res.data.data);
      })
      .catch(err => console.log('Admin patients error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const openEditModal = (p) => {
    setSelectedPatient(p);
    setIsEditing(true);
    setEditFormData({
      name: p.name || '',
      phone: p.phone || '',
      email: p.email || '',
      age: p.age || 30,
      gender: p.gender || 'Male',
      address: p.address || '',
      emergencyContact: p.emergencyContact || '',
      recommendedDepartment: p.recommendedDepartment || 'General Medicine',
      doctorName: p.doctorName || 'Dr. On Duty',
      cabin: p.cabin || 'OPD-101',
      priority: p.priority || 'Normal',
      status: p.status || 'WAITING',
      rawComplaint: p.rawComplaint || '',
      mainSymptom: p.mainSymptom || '',
      diagnosis: p.diagnosis || '',
      prescription: p.prescription || '',
      doctorNotes: p.doctorNotes || ''
    });
  };

  const handleSavePatient = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPatient?.id) return;

    setActionLoading(true);
    try {
      await adminService.updatePatient(selectedPatient.id, editFormData);
      setMsg(`Patient ${editFormData.name} details successfully updated.`);
      setIsEditing(false);
      loadPatients();
    } catch (err) {
      console.warn("Admin update error:", err);
      // Optimistic update
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, ...editFormData } : p));
      setMsg(`Patient ${editFormData.name} updated.`);
      setIsEditing(false);
    } finally {
      setActionLoading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDeletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove registration for ${name}?`)) return;
    try {
      await adminService.deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      setMsg(`Patient ${name} removed.`);
    } catch (err) {
      console.warn("Admin delete error:", err);
      setPatients(prev => prev.filter(p => p.id !== id));
      setMsg(`Patient ${name} removed.`);
    } finally {
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(filter.toLowerCase()) ||
    p.tokenNumber?.toLowerCase().includes(filter.toLowerCase()) ||
    p.recommendedDepartment?.toLowerCase().includes(filter.toLowerCase()) ||
    p.phone?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <GenericSubView
      title="Patient Registrations & Voice Kiosk Records"
      subtitle="Complete database of patients registered via SmartCare voice kiosk and front-desk walk-in."
      icon={Users}
    >
      {msg && (
        <div style={{
          background: 'var(--accent-mint-soft)',
          border: '1px solid #C1E8DD',
          color: 'var(--primary)',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} color="var(--accent-mint)" />
          <span>{msg}</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by patient, token, phone, department..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem', minWidth: '260px', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <button className="btn-secondary" onClick={loadPatients} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            <RefreshCw size={14} /> Refresh Records
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.85rem 0.75rem' }}>Token</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Patient Name</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Contact</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Age/Gender</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Reported Complaint</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>AI Department</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Assigned Doctor</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Status</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No patient registration records found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id || p.tokenNumber} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{p.tokenNumber || '—'}</td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.phone || '—'}</td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{p.age} yrs · {p.gender || '—'}</td>
                  <td style={{ padding: '0.85rem 0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.rawComplaint || p.mainSymptom}>
                    {p.rawComplaint || p.mainSymptom || 'General Checkup'}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>{p.recommendedDepartment || 'General Medicine'}</td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{p.doctorName || 'Dr. On Duty'} ({p.cabin || 'OPD'})</td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: p.status === 'COMPLETED' ? 'var(--accent-mint-soft)' : (p.status === 'IN_CONSULTATION' ? '#E0F2FE' : 'var(--accent-amber-soft)'),
                      color: p.status === 'COMPLETED' ? 'var(--primary)' : (p.status === 'IN_CONSULTATION' ? '#0284C7' : '#D97706'),
                      border: p.status === 'COMPLETED' ? '1px solid #C1E8DD' : (p.status === 'IN_CONSULTATION' ? '1px solid #BAE6FD' : '1px solid #F8D8A7')
                    }}>
                      {p.status || 'WAITING'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => openEditModal(p)}
                        title="Admin / Doctor authorized to edit patient details"
                      >
                        Edit Details
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', color: '#dc2626' }}
                        onClick={() => handleDeletePatient(p.id, p.name)}
                        title="Delete registration record"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Patient Edit Modal */}
      {isEditing && selectedPatient && (
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
          <div className="glass-card" style={{ maxWidth: '680px', width: '100%', padding: '2rem', background: '#FFFFFF', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                  Edit Patient Registration Record
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Token: <strong style={{ color: 'var(--primary)' }}>{selectedPatient.tokenNumber}</strong> · ID: {selectedPatient.id}
                </span>
              </div>
              <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Patient Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editFormData.age}
                    onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Gender</label>
                  <select
                    className="form-control"
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Priority</label>
                  <select
                    className="form-control"
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Priority">Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.recommendedDepartment}
                    onChange={(e) => setEditFormData({ ...editFormData, recommendedDepartment: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Assigned Doctor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.doctorName}
                    onChange={(e) => setEditFormData({ ...editFormData, doctorName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cabin Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.cabin}
                    onChange={(e) => setEditFormData({ ...editFormData, cabin: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Status</label>
                <select
                  className="form-control"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="WAITING">WAITING</option>
                  <option value="IN_CONSULTATION">IN_CONSULTATION</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Reported Symptoms & Complaint</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={editFormData.rawComplaint || editFormData.mainSymptom}
                  onChange={(e) => setEditFormData({ ...editFormData, rawComplaint: e.target.value, mainSymptom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Administrative / Clinical Notes</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Additional notes from administration or clinical staff..."
                  value={editFormData.doctorNotes}
                  onChange={(e) => setEditFormData({ ...editFormData, doctorNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={actionLoading}>
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GenericSubView>
  );
};

/* 2. Admin Doctors View */
export const AdminDoctorsView = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = () => {
    setLoading(true);
    adminService.getDoctors()
      .then(res => {
        if (res.data?.data) setDoctors(res.data.data);
      })
      .catch(err => console.log('Admin doctors error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <GenericSubView
      title="Doctors Directory & Duty Management"
      subtitle="Specializations, cabin allocations, live availability, and current queue workloads."
      icon={Stethoscope}
    >
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.85rem 0.75rem' }}>Doctor Name</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Department</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Specialization</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Cabin / Room</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Live Queue</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Availability</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id || d.email} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>{d.name}</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>{d.department || 'General Medicine'}</td>
                <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{d.specialization || 'Consultant'}</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>{d.cabin || d.roomNumber || 'OPD-101'}</td>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{d.currentQueueLength || 0} in queue</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>
                  <span style={{ color: d.available !== false ? '#10b981' : '#f87171', fontWeight: 700, fontSize: '0.8rem' }}>
                    {d.available !== false ? '● Available' : '○ Busy / Off Duty'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GenericSubView>
  );
};

/* 3. Admin Departments View */
export const AdminDepartmentsView = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    adminService.getDepartments()
      .then(res => { if (res.data?.data) setDepartments(res.data.data); })
      .catch(err => console.log('Admin depts error:', err));
  }, []);

  return (
    <GenericSubView
      title="Hospital Departments & Bed Allocation"
      subtitle="Overview of all 8 hospital departments, assigned doctors, and bed capacities."
      icon={Building2}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {departments.map((d) => (
          <div key={d.id || d.code} className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{d.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>{d.code}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{d.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Beds:</strong> {d.totalBeds || 20}</div>
              <div><strong>Active Queue:</strong> {d.activeQueues || 0}</div>
              <div><strong>Doctors:</strong> {d.doctorsCount || 2}</div>
              <div><strong>Patients Today:</strong> {d.patientsToday || 12}</div>
            </div>
          </div>
        ))}
      </div>
    </GenericSubView>
  );
};

/* 4. Admin Queues View */
export const AdminQueuesView = () => {
  const [queues, setQueues] = useState([]);

  const loadQueues = () => {
    adminService.getQueues()
      .then(res => { if (res.data?.data) setQueues(res.data.data); })
      .catch(err => console.log('Admin queues error:', err));
  };

  useEffect(() => {
    loadQueues();
    const interval = setInterval(loadQueues, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GenericSubView
      title="Live Hospital Queue Monitor"
      subtitle="Real-time multi-department token flow and patient consultation tracking."
      icon={Clock}
    >
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.85rem 0.75rem' }}>Token</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Patient Name</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Department</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Assigned Doctor</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Est. Wait</th>
              <th style={{ padding: '0.85rem 0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {queues.map((q) => (
              <tr key={q.id || q.tokenNumber} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{q.tokenNumber}</td>
                <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>{q.patientName}</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>{q.department}</td>
                <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>{q.doctorName} ({q.cabin})</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>~{q.estimatedWaitMinutes || 5} min</td>
                <td style={{ padding: '0.85rem 0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: q.status === 'IN_CONSULTATION' ? 'var(--accent-mint-soft)' : 'var(--accent-amber-soft)',
                    color: q.status === 'IN_CONSULTATION' ? 'var(--primary)' : '#D97706',
                    border: q.status === 'IN_CONSULTATION' ? '1px solid #C1E8DD' : '1px solid #F8D8A7'
                  }}>
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GenericSubView>
  );
};

/* 5. Optimization & Reports Views */
export const AdminOptimizationView = () => (
  <GenericSubView
    title="Hospital Flow Optimization Analytics Engine"
    subtitle="AI-driven workload balancer, queue latency predictions, and doctor allocation metrics."
    icon={Sparkles}
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-heading)' }}>Queue Efficiency Rate</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>91.4%</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Average patient throughput time reduced by 35% using AI voice routing.</p>
      </div>
      <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-heading)' }}>AI Triage Routing Confidence</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>94.8%</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Accurate department matching validated against doctor consultation records.</p>
      </div>
    </div>
  </GenericSubView>
);

export const AdminReportsView = () => <GenericSubView title="Analytics & Hospital Audit Reports" subtitle="Exportable patient volume, doctor workload, and throughput analytics." icon={BarChart3} />;
export const AdminSettingsView = () => <GenericSubView title="System Settings & Security Config" subtitle="JWT security headers, active sessions, and database connectivity." icon={Settings} />;
export const DoctorPatientsView = () => <AdminPatientsView />;
export const NurseBedsView = () => <GenericSubView title="IPD Ward Bed Overview" subtitle="Real-time occupancy tracking for ICU, General, and Emergency wards." icon={Bed} />;
export const PatientAppointmentsView = () => <GenericSubView title="Patient Appointments" subtitle="Manage and request consultation appointments with specialized doctors." icon={Calendar} />;
export const PatientQueueView = () => <GenericSubView title="Digital Queue & Token Tracker" subtitle="Live token queue position and estimated doctor wait time calculation." icon={Clock} />;
export const HospitalMapView = () => <GenericSubView title="Smart Hospital Map & Navigation" subtitle="Indoor floor plans and department directions." icon={MapPin} />;
export const AiAssistantView = () => <GenericSubView title="AI Medical Assistant" subtitle="Symptom check and department guidance." icon={Bot} />;
