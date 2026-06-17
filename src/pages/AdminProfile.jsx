import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoBadge } from '../components/AppHeader.jsx';

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LogoBadge small />
          <div>
            <h1 style={{ margin: 0 }}>{user?.name || 'Ranjith'}</h1>
            <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0' }}>Admin Profile · {user?.email}</p>
          </div>
        </div>
        <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section className="card">
          <h2>Your Information</h2>
          <div className="field">
            <label>Name</label>
            <input value={user?.name || 'Ranjith'} disabled />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={user?.email} disabled />
          </div>
          <div className="field">
            <label>Role</label>
            <input value="Administrator" disabled />
          </div>
        </section>

        <section className="card">
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <h2>Agent Management</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Add new agents to provide read-only access to sheet data.
            </p>
            <Link to="/admin/register" className="btn btn-admin">
              Create Agent Account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}