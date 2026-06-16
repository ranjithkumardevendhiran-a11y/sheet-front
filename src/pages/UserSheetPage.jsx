import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';
import SheetTable from '../components/SheetTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserSheetPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const [sheet, setSheet] = useState(null);
  const [sheetSearch, setSheetSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSheet() {
      try {
        const response = await api.get(`/sheets/${sheetId}`);
        setSheet(response.data);
      } catch (err) {
        setError('Failed to load sheet');
      }
    }

    fetchSheet();
  }, [sheetId]);

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Sheet Details</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/user" className="btn btn-secondary">Back to dashboard</Link>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="card" style={{ marginTop: '1.5rem' }}>
        {!sheet ? (
          <p>Loading sheet...</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0 }}>{sheet.title}</h2>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
                  {sheet.tab ? `${sheet.tab} · ` : ''}{sheet.sourceType === 'google' ? 'Google Sheet' : 'File upload'}
                </p>
              </div>
              <div style={{ minWidth: '18rem' }}>
                <input
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  placeholder="Search within sheet..."
                  className="field-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <SheetTable
              headers={sheet.headers}
              headerStyles={sheet.headerStyles}
              rows={sheet.rows}
              rowStyles={sheet.rowStyles}
              searchQuery={sheetSearch}
              editable={false}
            />
          </>
        )}

        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}
