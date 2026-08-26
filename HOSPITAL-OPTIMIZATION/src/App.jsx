import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Dashboards
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import NurseDashboard from './pages/dashboards/NurseDashboard';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// SubViews
import {
  PatientAppointmentsView,
  PatientQueueView,
  HospitalMapView,
  AiAssistantView,
  DoctorPatientsView,
  NurseBedsView,
  AdminOptimizationView,
  AdminReportsView,
  AdminSettingsView,
  GenericSubView
} from './pages/dashboards/SubViews';

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (role) {
    case 'PATIENT': return <Navigate to="/patient/dashboard" replace />;
    case 'DOCTOR': return <Navigate to="/doctor/dashboard" replace />;
    case 'NURSE': return <Navigate to="/nurse/dashboard" replace />;
    case 'RECEPTIONIST': return <Navigate to="/receptionist/dashboard" replace />;
    case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Root Redirection */}
      <Route path="/" element={<RootRedirect />} />

      {/* PATIENT Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']} />}>
        <Route path="/patient/dashboard" element={<AppLayout><PatientDashboard /></AppLayout>} />
        <Route path="/patient/appointments" element={<AppLayout><PatientAppointmentsView /></AppLayout>} />
        <Route path="/patient/queue" element={<AppLayout><PatientQueueView /></AppLayout>} />
        <Route path="/patient/profile" element={<AppLayout><GenericSubView title="Patient Profile" subtitle="Manage contact details and emergency contact records." /></AppLayout>} />
        <Route path="/hospital-map" element={<AppLayout><HospitalMapView /></AppLayout>} />
        <Route path="/ai-assistant" element={<AppLayout><AiAssistantView /></AppLayout>} />
      </Route>

      {/* DOCTOR Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
        <Route path="/doctor/dashboard" element={<AppLayout><DoctorDashboard /></AppLayout>} />
        <Route path="/doctor/patients" element={<AppLayout><DoctorPatientsView /></AppLayout>} />
        <Route path="/doctor/appointments" element={<AppLayout><GenericSubView title="Doctor Appointments Schedule" subtitle="OPD consultation calendar and appointment roster." /></AppLayout>} />
        <Route path="/doctor/queue" element={<AppLayout><GenericSubView title="Doctor Consultation Queue" subtitle="Call and update patient OPD queue status." /></AppLayout>} />
        <Route path="/doctor/consultations" element={<AppLayout><GenericSubView title="Clinical Notes & Prescriptions" subtitle="Add diagnosis notes, lab tests, and pharmacy prescriptions." /></AppLayout>} />
      </Route>

      {/* NURSE Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['NURSE', 'ADMIN']} />}>
        <Route path="/nurse/dashboard" element={<AppLayout><NurseDashboard /></AppLayout>} />
        <Route path="/nurse/patients" element={<AppLayout><GenericSubView title="In-Patient Ward Roster" subtitle="Vital signs chart and bedside nursing logs." /></AppLayout>} />
        <Route path="/nurse/queue" element={<AppLayout><GenericSubView title="Triage & Bedside Queue" subtitle="Prioritize incoming emergency or ward transfer patients." /></AppLayout>} />
        <Route path="/nurse/beds" element={<AppLayout><NurseBedsView /></AppLayout>} />
        <Route path="/nurse/wards" element={<AppLayout><GenericSubView title="Ward Occupancy & Equipment" subtitle="ICU, Special Ward, and General Ward status." /></AppLayout>} />
      </Route>

      {/* RECEPTIONIST Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']} />}>
        <Route path="/receptionist/dashboard" element={<AppLayout><ReceptionistDashboard /></AppLayout>} />
        <Route path="/receptionist/registration" element={<AppLayout><GenericSubView title="OPD Patient Registration" subtitle="Register new walk-in patients and assign doctors." /></AppLayout>} />
        <Route path="/receptionist/appointments" element={<AppLayout><GenericSubView title="Appointment Scheduling" subtitle="Book, reschedule, or cancel patient appointments." /></AppLayout>} />
        <Route path="/receptionist/queue" element={<AppLayout><GenericSubView title="Token Queue Dispenser" subtitle="Issue sequential queue tokens for OPD consultations." /></AppLayout>} />
        <Route path="/receptionist/doctors" element={<AppLayout><GenericSubView title="Doctor Duty Availability" subtitle="Check real-time doctor availability and duty rosters." /></AppLayout>} />
        <Route path="/receptionist/billing" element={<AppLayout><GenericSubView title="Billing & Invoicing Counter" subtitle="Process consultation fees, lab invoices, and payments." /></AppLayout>} />
      </Route>

      {/* ADMIN Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
        <Route path="/admin/users" element={<AppLayout><AdminDashboard /></AppLayout>} />
        <Route path="/admin/doctors" element={<AppLayout><GenericSubView title="Doctor Management" subtitle="Manage doctor accounts, specializations, and OPD rooms." /></AppLayout>} />
        <Route path="/admin/nurses" element={<AppLayout><GenericSubView title="Nurse Staffing Management" subtitle="Manage nursing staff ward assignments and shifts." /></AppLayout>} />
        <Route path="/admin/receptionists" element={<AppLayout><GenericSubView title="Reception Staff Control" subtitle="Manage reception desk access credentials." /></AppLayout>} />
        <Route path="/admin/patients" element={<AppLayout><GenericSubView title="Master Patient Database" subtitle="View all registered hospital patients and medical records." /></AppLayout>} />
        <Route path="/admin/appointments" element={<AppLayout><GenericSubView title="Hospital-Wide Appointments" subtitle="Master view of all hospital consultation appointments." /></AppLayout>} />
        <Route path="/admin/departments" element={<AppLayout><GenericSubView title="Department Administration" subtitle="Cardiology, Orthopedics, Pediatrics, Neurology, Emergency." /></AppLayout>} />
        <Route path="/admin/beds" element={<AppLayout><NurseBedsView /></AppLayout>} />
        <Route path="/admin/queues" element={<AppLayout><GenericSubView title="Global Queue Monitor" subtitle="Monitor queue congestion across all OPD rooms." /></AppLayout>} />
        <Route path="/admin/optimization" element={<AppLayout><AdminOptimizationView /></AppLayout>} />
        <Route path="/admin/reports" element={<AppLayout><AdminReportsView /></AppLayout>} />
        <Route path="/admin/settings" element={<AppLayout><AdminSettingsView /></AppLayout>} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
