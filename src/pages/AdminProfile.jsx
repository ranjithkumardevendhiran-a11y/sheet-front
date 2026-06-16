import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoBadge } from '../components/AppHeader.jsx';

export default function AdminProfile() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register-user', { name, email, password });
      setSuccess(`Agent ${name} registered successfully.`);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register agent');
    } finally {
      setLoading(false);
    }
  };

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
          {!showForm ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <h2>Agent Management</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                Add new agents to provide read-only access to sheet data.
              </p>
              <button className="btn btn-admin" onClick={() => setShowForm(true)}>
                Create Agent Account
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Register New Agent</h2>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
              <form onSubmit={handleRegisterAgent}>
                <div className="field">
                  <label htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="reg-email">Email Address</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="reg-pass">Password</label>
                  <input
                    id="reg-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button className="btn btn-admin" type="submit" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Registering...' : 'Create Agent Account'}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}