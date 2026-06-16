import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';
import SheetTable from '../components/SheetTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminSheetPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sheetId } = useParams();
  const [sheet, setSheet] = useState(null);
  const [title, setTitle] = useState('');
  const [tab, setTab] = useState('General');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [sheetSearch, setSheetSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSheet() {
      try {
        const response = await api.get(`/sheets/${sheetId}`);
        const sheetData = response.data;
        setSheet(sheetData);
        setTitle(sheetData.title);
        setTab(sheetData.tab || 'General');
        setHeaders(sheetData.headers);
        setRows(sheetData.rows);
      } catch (err) {
        setError('Failed to load sheet');
      }
    }

    fetchSheet();
  }, [sheetId]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? row.map((cell, cellIndex) => (cellIndex === colIndex ? value : cell)) : row
      )
    );
  };

  const handleAddRow = () => {
    setRows((current) => [...current, headers.map(() => '')]);
  };

  const handleDeleteRow = (rowIndex) => {
    setRows((current) => current.filter((_, index) => index !== rowIndex));
  };

  const handleSave = async () => {
    if (!sheet) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put(`/sheets/${sheet._id}`, {
        title: title.trim() || sheet.title,
        tab: tab.trim() || 'General',
        headers,
        rows,
      });
      setSheet(response.data);
      setMessage('Sheet saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sheet');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSheet = async () => {
    if (!sheet) return;
    if (!window.confirm('Delete this sheet permanently?')) return;

    try {
      await api.delete(`/sheets/${sheet._id}`);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sheet');
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 0 3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Sheet</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)' }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin" className="btn btn-secondary">Back to dashboard</Link>
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
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-admin" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn btn-danger" onClick={handleDeleteSheet}>Delete Sheet</button>
              </div>
            </div>

            <div className="field" style={{ marginTop: '1rem' }}>
              <label htmlFor="sheet-title">Sheet title</label>
              <input id="sheet-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="sheet-tab">Sheet tab</label>
              <input id="sheet-tab" value={tab} onChange={(e) => setTab(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="sheet-search">Search within sheet</label>
              <input
                id="sheet-search"
                value={sheetSearch}
                onChange={(e) => setSheetSearch(e.target.value)}
                placeholder="Search rows in this sheet"
              />
            </div>

            <SheetTable
              headers={headers}
              rows={rows}
              searchQuery={sheetSearch}
              editable
              onCellChange={handleCellChange}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
            />

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
}
