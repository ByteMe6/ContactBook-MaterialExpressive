import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getContacts } from "./api/getContacts.js";
import { createContact } from "./api/addContact.js";
import { login as loginAPI } from "./api/login.js";
import axiosInstance from "./api/axiosInstance.js";

export default function Contacts({ setUser }) {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [addError, setAddError] = useState('');

  // re-auth
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  /* =========================
     AUTH / RE-AUTH
     ========================= */

  const handle401 = (retryFn) => {
    setPendingAction(() => retryFn);
    setShowReauthModal(true);
  };

  const handleReauth = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!reauthPassword || reauthPassword.trim().length === 0) {
      setReauthError("Password required");
      return;
    }

    try {
      setReauthLoading(true);
      setReauthError("");

      const res = await loginAPI(
          user.login,          // ← ВАЖНО
          reauthPassword
      );

      const token = res.data.token || res.data.access_token;
      if (!token) throw new Error("No token");

      localStorage.setItem("token", token);

      setShowReauthModal(false);
      setReauthPassword("");

      if (pendingAction) {
        await pendingAction();
        setPendingAction(null);
      }
    } catch {
      setReauthError("Invalid password");
    } finally {
      setReauthLoading(false);
    }
  };

  /* =========================
     CONTACTS
     ========================= */

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      if (err.response?.status === 401) {
        handle401(loadContacts);
        return;
      }
      setError("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async () => {
    setAddError("");

    if (!newContactName.trim() || !newContactPhone.trim()) {
      setAddError("Name and phone are required");
      return;
    }

    try {
      const newContact = await createContact(
          newContactName.trim(),
          newContactPhone.trim()
      );

      setContacts(prev => [...prev, newContact]);
      setNewContactName("");
      setNewContactPhone("");
    } catch (err) {
      if (err.response?.status === 401) {
        handle401(handleAddContact);
        return;
      }
      setAddError("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await axiosInstance.delete(`/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        handle401(() => handleDeleteContact(id));
        return;
      }
      alert("Failed to delete contact");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  /* =========================
     RENDER
     ========================= */

  if (isLoading && !showReauthModal) {
    return (
        <main>
          <div className="header-actions">
            <h1>Contacts</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <p className="empty-state">Loading...</p>
        </main>
    );
  }

  return (
      <>
        <main>
          <div className="header-actions">
            <h1>Contacts</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <button onClick={loadContacts}>Refresh</button>

          {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

          {contacts.length === 0 && !error && (
              <p className="empty-state">📱 No contacts</p>
          )}

          <ul>
            {contacts.map(c => (
                <li key={c.id}>
                  <div>
                    <strong>{c.name}</strong><br />
                    📞 {c.phoneNumber}
                  </div>
                  <button onClick={() => handleDeleteContact(c.id)}>
                    Delete
                  </button>
                </li>
            ))}
          </ul>

          <div className="addCont">
            <h3>Add Contact</h3>

            {addError && <p style={{ color: 'var(--error)' }}>{addError}</p>}

            <input
                className="addContInp"
                placeholder="Name"
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
            />

            <input
                className="addContInp"
                placeholder="Phone"
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
            />

            <button className="addContBtn" onClick={handleAddContact}>
              Add Contact
            </button>
          </div>
        </main>

        {/* RE-AUTH MODAL */}
        {showReauthModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="auth-box">
                <h2>Session expired</h2>

                {reauthError && <p style={{ color: 'var(--error)' }}>{reauthError}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    value={reauthPassword}
                    onChange={e => setReauthPassword(e.target.value)}
                />

                <button onClick={handleReauth} disabled={reauthLoading}>
                  Continue
                </button>

                <button
                    onClick={handleLogout}
                    style={{ background: 'transparent', color: 'var(--on-surface-variant)' }}
                >
                  Logout
                </button>
              </div>
            </div>
        )}
      </>
  );
}