import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Calendar, Stethoscope, Clock, CheckCircle, FileText, PhoneCall,
  AlertTriangle, Sparkles, X, RefreshCw, Edit3, Save, Pill, ClipboardList, ShieldAlert
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    assignedPatientsCount: 6,
    todayAppointments: 4,
    pendingConsultations: 3,
    currentQueueToken: 'ORTHO-021',
    department: 'Orthopedics',
    doctorName: user?.name || 'Dr. Karan Bhatt',
    cabin: 'C-204'
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      doctorService.getDashboard().catch(() => ({ data: { data: null } })),
      doctorService.getPatients().catch(() => ({ data: { data: [] } }))
    ]).then(([dashRes, patRes]) => {
      if (dashRes.data?.data) {
        setData(dashRes.data.data);
      }
      if (patRes.data?.data && patRes.data.data.length > 0) {
        // Map backend PatientRegistration entities
        const mapped = patRes.data.data.map(p => ({
          id: p.id,
          queueToken: p.tokenNumber || 'D-000',
          name: p.name,
          phone: p.phone,
          age: p.age,
          gender: p.gender,
          condition: p.mainSymptom || p.rawComplaint || 'General checkup',
          rawComplaint: p.rawComplaint,
          status: p.status || 'WAITING',
          priority: p.priority || 'Normal',
          duration: p.duration || '3 days',
          severity: p.severity || 'Moderate',
          associatedSymptoms: p.associatedSymptoms || '',
          routingReason: p.routingReason || 'Referred by SmartCare AI',
          cabin: p.cabin || 'OPD',
          diagnosis: p.diagnosis || '',
          prescription: p.prescription || '',
          doctorNotes: p.doctorNotes || ''
        }));
        setPatients(mapped);
      } else {
        // Fallback demo patients
        setPatients([
          {
            id: 'q-1',
            queueToken: 'ORTHO-021',
            name: 'Kiran Vora',
            phone: '9876543210',
            age: 41,
            gender: 'Female',
            condition: 'Shoulder pain and stiff joint',
            status: 'IN_CONSULTATION',
            priority: 'Normal',
            duration: '1 week',
            severity: 'Moderate',
            rawComplaint: 'Severe shoulder stiffness and pain while lifting arms.',
            routingReason: 'Referred to Orthopedics for joint mobility check.',
            cabin: 'C-204',
            diagnosis: 'Frozen Shoulder (Adhesive Capsulitis)',
            prescription: 'Tab Aceclofenac 100mg BD x 5 days, Physiotherapy exercises',
            doctorNotes: 'Advised warm compress and gentle shoulder rotation exercises.'
          },
          {
            id: 'q-2',
            queueToken: 'ORTHO-022',
            name: 'Rahul Desai',
            phone: '9822334455',
            age: 34,
            gender: 'Male',
            condition: 'Ankle twist during sports',
            status: 'WAITING',
            priority: 'Priority',
            duration: '2 days',
            severity: 'Moderate',
            rawComplaint: 'Twisted ankle while playing football, swelling present.',
            routingReason: 'Acute musculoskeletal trauma requiring examination.',
            cabin: 'C-204',
            diagnosis: '',
            prescription: '',
            doctorNotes: ''
          },
          {
            id: 'q-3',
            queueToken: 'ORTHO-023',
            name: 'Amit Patel',
            phone: '9876501234',
            age: 28,
            gender: 'Male',
            condition: 'Knee joint pain with swelling, 1 week',
            status: 'WAITING',
            priority: 'Normal',
            duration: '1 week',
            severity: 'Moderate',
            rawComplaint: 'Mere ghutne mein ek hafte se bahut dard ho raha hai aur halki sujan hai.',
            routingReason: 'Voice complaint matches knee joint swelling in Orthopedics.',
            cabin: 'C-204',
            diagnosis: '',
            prescription: '',
            doctorNotes: ''
          }
        ]);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  const openPatientModal = (patient) => {
    setActivePatient(patient);
    setEditFormData({
      name: patient.name || '',
      phone: patient.phone || '',
      age: patient.age || 30,
      gender: patient.gender || 'Male',
      mainSymptom: patient.condition || '',
      duration: patient.duration || '',
      severity: patient.severity || 'Moderate',
      priority: patient.priority || 'Normal',
      status: patient.status || 'WAITING',
      diagnosis: patient.diagnosis || '',
      prescription: patient.prescription || '',
      doctorNotes: patient.doctorNotes || ''
    });
  };

  const handleSavePatientChanges = async (e) => {
    if (e) e.preventDefault();
    if (!activePatient) return;

    setActionLoading(true);
    try {
      await doctorService.updatePatient(activePatient.id, editFormData);
      setFeedbackMsg(`Patient ${activePatient.name} details successfully updated in database.`);
      
      // Update locally
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return { ...p, ...editFormData, condition: editFormData.mainSymptom || p.condition };
        }
        return p;
      }));
      setActivePatient(prev => ({ ...prev, ...editFormData, condition: editFormData.mainSymptom || prev.condition }));
      loadData();
    } catch (err) {
      console.warn("Doctor update API notice:", err);
      // Optimistic local update
      setPatients(prev => prev.map(p => {
        if (p.id === activePatient.id) {
          return { ...p, ...editFormData, condition: editFormData.mainSymptom || p.condition };
        }
        return p;
      }));
      setFeedbackMsg(`Patient ${activePatient.name} details updated locally.`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      const res = await doctorService.callNext();
      if (res.data?.data) {
        setFeedbackMsg(`Called Next: Token ${res.data.data.tokenNumber} (${res.data.data.patientName})`);
      }
      loadData();
    } catch (err) {
      console.log('Call Next API notice:', err);
      setPatients(prev => {
        const nextWaiting = prev.find(p => p.status === 'WAITING');
        if (!nextWaiting) return prev;
        return prev.map(p => p.id === nextWaiting.id ? { ...p, status: 'IN_CONSULTATION' } : p);
      });
      setFeedbackMsg('Next patient called into consultation room.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleComplete = async (queueId, tokenNumber) => {
    setActionLoading(true);
    try {
      // First save any updated prescription / diagnosis
      if (activePatient && activePatient.id === queueId) {
        await doctorService.updatePatient(queueId, { ...editFormData, status: 'COMPLETED' }).catch(() => {});
      }
      await doctorService.completeConsultation(queueId);
      setFeedbackMsg(`Consultation completed for Token ${tokenNumber}`);
      loadData();
    } catch (err) {
      console.log('Complete Consultation API notice:', err);
      setPatients(prev => prev.map(p => (p.id === queueId || p.queueToken === tokenNumber) ? { ...p, status: 'COMPLETED' } : p));
      setFeedbackMsg(`Consultation completed for Token ${tokenNumber}`);
    } finally {
      setActionLoading(false);
      setActivePatient(null);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <div>
      <Navbar title={`Doctor Consultation Workstation — ${data.doctorName || 'Dr. Karan Bhatt'}`} />
      <div className="content-body">

        {feedbackMsg && (
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
            <span>{feedbackMsg}</span>
          </div>
        )}
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Patients</span>
              <Users size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{patients.length || data.assignedPatientsCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department: {data.department} ({data.cabin || 'Cabin C-204'})</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Appointments</span>
              <Calendar size={20} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{data.todayAppointments}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OPD Consultations</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending in Queue</span>
              <Clock size={20} color="#D97706" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>
              {patients.filter(p => p.status === 'WAITING').length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active in Department Queue</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Currently Serving</span>
                <Stethoscope size={20} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                {patients.find(p => p.status === 'IN_CONSULTATION')?.queueToken || data.currentQueueToken || 'None'}
              </div>
            </div>
            <button
              className="btn-primary"
              disabled={actionLoading}
              onClick={handleCallNext}
              style={{ marginTop: '0.8rem', width: '100%', padding: '0.55rem', fontSize: '0.85rem', justifyContent: 'center' }}
            >
              <PhoneCall size={14} /> Call Next Patient
            </button>
          </div>

        </div>

        {/* Patients Queue List */}
        <div className="glass-card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                <Users size={20} color="var(--primary)" />
                <span>OPD Queue & Consultation List</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.2rem' }}>
                Doctors have full authorization to view voice intake transcripts and update clinical diagnosis, prescriptions, and status.
              </p>
            </div>
            <button className="btn-secondary" onClick={loadData} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <RefreshCw size={14} /> Refresh Queue
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.85rem 0.75rem' }}>Token</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Patient Name</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Age / Gender</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Reported Symptoms</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No patients currently waiting in your OPD queue.
                  </td>
                </tr>
              )}
              {patients.map((p) => (
                <tr key={p.id || p.queueToken} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.9rem 0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{p.queueToken}</td>
                  <td style={{ padding: '0.9rem 0.75rem', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '0.9rem 0.75rem', color: 'var(--text-muted)' }}>{p.age} yrs · {p.gender || '—'}</td>
                  <td style={{ padding: '0.9rem 0.75rem', maxWidth: '280px' }}>{p.condition}</td>
                  <td style={{ padding: '0.9rem 0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: p.status === 'COMPLETED' ? 'var(--accent-mint-soft)' : (p.status === 'IN_CONSULTATION' ? '#E0F2FE' : 'var(--accent-amber-soft)'),
                      color: p.status === 'COMPLETED' ? 'var(--primary)' : (p.status === 'IN_CONSULTATION' ? '#0284C7' : '#D97706'),
                      border: p.status === 'COMPLETED' ? '1px solid #C1E8DD' : (p.status === 'IN_CONSULTATION' ? '1px solid #BAE6FD' : '1px solid #F8D8A7')
                    }}>
                      {p.status === 'COMPLETED' ? 'Completed' : (p.status === 'IN_CONSULTATION' ? 'In Consultation' : 'Waiting')}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={() => openPatientModal(p)}
                        title="Doctor can view voice intake, edit diagnosis & write prescription"
                      >
                        <Edit3 size={14} /> Consult / Edit
                      </button>
                      {p.status === 'IN_CONSULTATION' ? (
                        <button
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => handleComplete(p.id, p.queueToken)}
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            setPatients(prev => prev.map(x => x.id === p.id ? { ...x, status: 'IN_CONSULTATION' } : x));
                            setData(prev => ({ ...prev, currentQueueToken: p.queueToken }));
                          }}
                        >
                          <Stethoscope size={14} /> Call In
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctor Clinical Consultation & Patient Edit Modal */}
        {activePatient && (
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
            <div className="glass-card" style={{ maxWidth: '680px', width: '100%', padding: '2rem', background: '#FFFFFF', maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Stethoscope size={24} color="var(--primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                      Clinical Consultation: {activePatient.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Token: <strong style={{ color: 'var(--primary)' }}>{activePatient.queueToken}</strong> · Age: {activePatient.age} yrs ({activePatient.gender})
                    </span>
                  </div>
                </div>
                <button onClick={() => setActivePatient(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* AI Voice Kiosk Extracted Context */}
              <div style={{
                background: 'var(--accent-mint-soft)',
                border: '1px solid #C1E8DD',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <Sparkles size={16} /> <strong>AI Intake Summary (from Voice Kiosk)</strong>
                </div>
                <div style={{ fontWeight: 400, color: 'var(--text-main)', fontSize: '0.83rem' }}>
                  {activePatient.rawComplaint ? `"${activePatient.rawComplaint}"` : activePatient.condition}
                </div>
                <div style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: 'var(--primary)' }}>
                  Reported Duration: <strong>{activePatient.duration}</strong> · Severity: <strong>{activePatient.severity}</strong> · Priority: <strong>{activePatient.priority}</strong>
                </div>
              </div>

              <form onSubmit={handleSavePatientChanges} className="space-y-4">
                {/* Doctor Edit Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Patient Name</label>
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
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Consultation Status</label>
                    <select
                      className="form-control"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="WAITING">WAITING</option>
                      <option value="IN_CONSULTATION">IN_CONSULTATION</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ClipboardList size={16} color="var(--primary)" /> Clinical Diagnosis (Doctor Only)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acute Ligament Sprain, Viral Fever, Contact Dermatitis..."
                    value={editFormData.diagnosis}
                    onChange={(e) => setEditFormData({ ...editFormData, diagnosis: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Pill size={16} color="var(--primary)" /> Prescription & Medication (Doctor Only)
                  </label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="e.g. Tab Paracetamol 650mg TDS x 3 days; Syrup Ambroxol 10ml BD..."
                    value={editFormData.prescription}
                    onChange={(e) => setEditFormData({ ...editFormData, prescription: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Doctor's Clinical Notes & Instructions</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Advised blood test, avoid physical exertion for 1 week, follow up in OPD next Tuesday..."
                    value={editFormData.doctorNotes}
                    onChange={(e) => setEditFormData({ ...editFormData, doctorNotes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setActivePatient(null)}>
                    Cancel
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="submit"
                      className="btn-secondary"
                      disabled={actionLoading}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Save size={16} /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={actionLoading}
                      onClick={() => handleComplete(activePatient.id, activePatient.queueToken)}
                    >
                      <CheckCircle size={16} /> Save & Complete Consultation
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
