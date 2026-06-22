export function LogoBadge({ small = false }) {
  return (
    <div className={`logo-badge${small ? ' logo-badge-small' : ''}`}>
      <img src="/image1.png" alt="myTVS" style={{ height: small ? 30 : 50 }} />
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