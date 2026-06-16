import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import UploadSheet from '../components/UploadSheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSheets = async (searchTerm = '', tabFilter = 'All') => {
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());
    if (tabFilter && tabFilter !== 'All') query.append('tab', tabFilter);

    const response = await api.get(`/sheets?${query.toString()}`);
    setSheets(response.data);
  };

  const tabOptions = useMemo(
    () => ['All', ...Array.from(new Set(sheets.map((sheet) => sheet.tab || 'General')))],
    [sheets]
  );

  useEffect(() => {
    loadSheets(search, selectedTab)
      .catch(() => setError('Failed to load sheets'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn btn-secondary">Home</Link>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <UploadSheet
        onUploaded={(sheet) => {
          loadSheets();
          navigate(`/admin/sheet/${sheet._id}`);
        }}
      />

      <section className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ marginTop: 0 }}>Uploaded Sheets</h2>
            <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
              Filter by tab or search keywords across titles and uploaded data.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem', width: '100%', maxWidth: '28rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sheets..."
                className="field-input"
                style={{ flex: 1, minWidth: '12rem' }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => loadSheets(search, selectedTab)}
              >
                Search
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {useMemo(() => ['All', ...Array.from(new Set(sheets.map((sheet) => sheet.tab || 'General')))], [sheets]).map((tabName) => (
                <button
                  type="button"
                  key={tabName}
                  className={`btn ${selectedTab === tabName ? 'btn-admin' : 'btn-secondary'}`}
                  onClick={() => {
                    setSelectedTab(tabName);
                    loadSheets(search, tabName);
                  }}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading sheets...</p>
        ) : sheets.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No sheets uploaded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {sheets.map((sheet) => (
              <button
                key={sheet._id}
                type="button"
                className="btn btn-secondary"
                style={{
                  textAlign: 'left',
                  border: '1px solid var(--border)',
                }}
                onClick={() => navigate(`/admin/sheet/${sheet._id}`)}
              >
                <strong>{sheet.title}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {sheet.tab ? `${sheet.tab} · ` : ''}{sheet.sourceType === 'google' ? 'Google Sheet' : 'File upload'} · Updated {new Date(sheet.updatedAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
