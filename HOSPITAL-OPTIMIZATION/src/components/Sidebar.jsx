import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Activity,
  Calendar,
  Clock,
  Bed,
  MapPin,
  Bot,
  Bell,
  User,
  Settings,
  BarChart3,
  Sparkles,
  LogOut,
  Building2,
  Receipt,
  UserPlus,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

import SmartCareLogo from './SmartCareLogo';

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (role) {
      case 'PATIENT':
        return [
          { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
          { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
          { label: 'Queue Status', path: '/patient/queue', icon: Clock },
          { label: 'Hospital Map', path: '/hospital-map', icon: MapPin },
          { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
          { label: 'Notifications', path: '/patient/notifications', icon: Bell },
          { label: 'Profile', path: '/patient/profile', icon: User },
        ];

      case 'DOCTOR':
        return [
          { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
          { label: 'Patients', path: '/doctor/patients', icon: Users },
          { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
          { label: 'Queue', path: '/doctor/queue', icon: Clock },
          { label: 'Consultations', path: '/doctor/consultations', icon: Stethoscope },
          { label: 'Notifications', path: '/doctor/notifications', icon: Bell },
          { label: 'Profile', path: '/doctor/profile', icon: User },
        ];

      case 'NURSE':
        return [
          { label: 'Dashboard', path: '/nurse/dashboard', icon: LayoutDashboard },
          { label: 'Beds & Wards', path: '/nurse/beds', icon: Bed },
          { label: 'Patient Vitals', path: '/nurse/vitals', icon: Activity },
          { label: 'Tasks', path: '/nurse/tasks', icon: Clock },
          { label: 'Notifications', path: '/nurse/notifications', icon: Bell },
          { label: 'Profile', path: '/nurse/profile', icon: User },
        ];

      case 'RECEPTIONIST':
        return [
          { label: 'Dashboard', path: '/receptionist/dashboard', icon: LayoutDashboard },
          { label: 'Register Patient', path: '/receptionist/register-patient', icon: UserPlus },
          { label: 'Active Queues', path: '/receptionist/queues', icon: Clock },
          { label: 'Appointments', path: '/receptionist/appointments', icon: Calendar },
          { label: 'Billing & Token', path: '/receptionist/billing', icon: Receipt },
          { label: 'Profile', path: '/receptionist/profile', icon: User },
        ];

      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
          { label: 'Nurses', path: '/admin/nurses', icon: Users },
          { label: 'Receptionists', path: '/admin/receptionists', icon: UserCheck },
          { label: 'Patients', path: '/admin/patients', icon: Users },
          { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
          { label: 'Departments', path: '/admin/departments', icon: Building2 },
          { label: 'Beds', path: '/admin/beds', icon: Bed },
          { label: 'Queues', path: '/admin/queues', icon: Clock },
          { label: 'Optimization', path: '/admin/optimization', icon: Sparkles },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside style={{
      width: '260px',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1.25rem 1rem'
    }}>
      {/* Brand Header - SmartCare Official Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1.5rem' }}>
        <SmartCareLogo size={38} />
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F3B3A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>SmartCare</h2>
          <span style={{ fontSize: '0.75rem', color: '#5C6864', fontWeight: 600 }}>Clinical & Hospital Portal</span>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 500 }}>Active Workspace</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
            {user?.name || 'User'}
          </span>
          <span className={`role-badge ${role}`}>{role}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#0F3B3A' : 'var(--text-muted)',
                background: isActive ? '#E4F5F0' : 'transparent',
                borderLeft: isActive ? '3px solid #3FBFA0' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} color={undefined} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Logout Button */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
        <button
          onClick={handleLogout}
          id="btn-sidebar-logout"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 0.85rem',
            background: 'var(--accent-rose-soft)',
            color: 'var(--accent-rose)',
            border: '1px solid #F6C8C8',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
