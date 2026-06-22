import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoBadge } from '../components/AppHeader.jsx';

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, 'user');
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: '4rem 0',
        backgroundImage: 'url(/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <section className="container card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <LogoBadge small />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h1 style={{ margin: 0 }}>Agent Login</h1>
          <span className="badge badge-user">Agent</span>
        </div>
        <p style={{ color: 'var(--muted)' }}>
          Sign in to view sheet data in read-only mode.
        </p>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="user-password">Password</label>
            <input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-user" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : 'Sign in as Agent'}
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          <Link to="/">Back to home</Link> · <Link to="/admin/login">Admin login</Link>
        </p>
      </section>
    </main>
  );
}