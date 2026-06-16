export function LogoBadge({ small = false }) {
  return (
    <div className={`logo-badge${small ? ' logo-badge-small' : ''}`}>
      <div className="app-logo-mark">TVS</div>
      <div className="app-logo-text">
        <span className="brand">myTVS</span>
        {!small && <span className="tagline">India's Largest Multi-Brand Car Service Network</span>}
      </div>
    </div>
  );
}

import { useAuth } from '../context/AuthContext.jsx';
import ProfileAvatar from './ProfileAvatar.jsx';

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner" style={{ justifyContent: 'space-between' }}>
        <LogoBadge />
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ProfileAvatar user={user} />
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem' }}>
              {user.name || user.email}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
