import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {getContacts} from "./api/getContacts.js";
import {createContact} from "./api/addContact.js";
import {login as loginAPI} from "./api/login.js";

export default function Contacts({setUser}) {
  const navigate = useNavigate();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [addError, setAddError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-authentication modal state
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleReauth = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userLogin = userData.login;

    if (!userLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
      return;
    }

    if (!reauthPassword) {
      setReauthError('Please enter your password');
      return;
    }

    setReauthLoading(true);
    setReauthError('');

    try {
      const response = await loginAPI(userLogin, reauthPassword);
      const token = response.data.token || response.data.access_token;

      if (!token) {
        throw new Error('No token received');
      }

      // Update token
      localStorage.setItem('token', token);
      console.log('✅ Token refreshed successfully');

      // Close modal
      setShowReauthModal(false);
      setReauthPassword('');
      setReauthError('');

      // Retry pending action
      if (pendingAction) {
        await pendingAction();
        setPendingAction(null);
      }
    } catch (err) {
      console.error('❌ Re-auth failed:', err);
      setReauthError('Invalid password. Please try again.');
    } finally {
      setReauthLoading(false);
    }
  };

  const handle401Error = (actionToRetry) => {
    setPendingAction(() => actionToRetry);
    setShowReauthModal(true);
  };

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);

      if (err.response?.status === 401) {
        handle401Error(loadContacts);
      } else {
        setError('Failed to load contacts. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async () => {
    setAddError('');

    if (!newContactName.trim()) {
      setAddError('Please enter a contact name');
      return;
    }

    if (!newContactPhone.trim()) {
      setAddError('Please enter a phone number');
      return;
    }

    const phoneRegex = /^[+\d\s()-]+$/;
    if (!phoneRegex.test(newContactPhone)) {
      setAddError('Please enter a valid phone number');
      return;
    }

    try {
      const newContact = await createContact(newContactName, newContactPhone);
      setContacts(prev => [...prev, newContact]);
      setNewContactName('');
      setNewContactPhone('');
      setAddError('');
    } catch (err) {
      console.error('Failed to add contact:', err);

      if (err.response?.status === 401) {
        handle401Error(handleAddContact);
      } else {
        setAddError(err.response?.data?.message || 'Failed to add contact');
      }
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Delete contact "${name}"?`)) {
      try {
        const response = await fetch(`https://api.hellper.dev/contacts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 401) {
          handle401Error(() => handleDeleteContact(id, name));
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to delete');
        }

        setContacts(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Failed to delete contact:', err);
        alert('Failed to delete contact');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddContact();
    }
  };

  const handleReauthKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReauth();
    }
  };

  if (isLoading) {
    return (
        <main>
          <div className="header-actions">
            <h1>Contacts</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <p className="empty-state">Loading contacts...</p>
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

          <button onClick={loadContacts}>
            Refresh Contacts
          </button>

          {error && (
              <p style={{
                color: 'var(--error)',
                background: 'rgba(242, 139, 130, 0.15)',
                padding: '12px 16px',
                borderRadius: '12px',
                borderLeft: '3px solid var(--error)'
              }}>
                {error}
              </p>
          )}

          {contacts.length <= 0 && !error && (
              <p className="empty-state">
                📱 No contacts yet. Add your first contact below!
              </p>
          )}

          <ul>
            {contacts.map((contact) => (
                <li key={contact.id}>
                  <div>
                    <strong>{contact.name}</strong>
                    <br/>
                    📞 {contact.phoneNumber}
                  </div>
                  <button onClick={() => handleDeleteContact(contact.id, contact.name)}>
                    Delete
                  </button>
                </li>
            ))}
          </ul>

          <div className="addCont">
            <h3>Add New Contact</h3>

            {addError && (
                <p style={{
                  color: 'var(--error)',
                  marginBottom: '12px',
                  fontSize: '14px',
                  background: 'rgba(242, 139, 130, 0.15)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  borderLeft: '3px solid var(--error)'
                }}>
                  {addError}
                </p>
            )}

            <input
                type="text"
                className="addContInp"
                placeholder="Name *"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <input
                type="tel"
                className="addContInp"
                placeholder="Phone Number *"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                onKeyPress={handleKeyPress}
            />

            <button
                className="addContBtn"
                onClick={handleAddContact}
            >
              Add Contact
            </button>
          </div>
        </main>

        {/* Re-authentication Modal */}
        {showReauthModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div className="auth-box" style={{ margin: '20px' }}>
                <h2>Session Expired</h2>
                <p style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: 'var(--on-surface-variant)'
                }}>
                  Please re-enter your password to continue
                </p>

                {reauthError && (
                    <div style={{
                      background: 'rgba(242, 139, 130, 0.15)',
                      color: 'var(--error)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      borderLeft: '3px solid var(--error)',
                      textAlign: 'left'
                    }}>
                      {reauthError}
                    </div>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={reauthPassword}
                    onChange={(e) => {
                      setReauthPassword(e.target.value);
                      setReauthError('');
                    }}
                    onKeyPress={handleReauthKeyPress}
                    disabled={reauthLoading}
                    autoFocus
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                      onClick={handleReauth}
                      disabled={reauthLoading}
                      style={{ flex: 1 }}
                  >
                    {reauthLoading ? 'Authenticating...' : 'Continue'}
                  </button>
                  <button
                      onClick={() => {
                        setShowReauthModal(false);
                        setReauthPassword('');
                        setReauthError('');
                        setPendingAction(null);
                        handleLogout();
                      }}
                      disabled={reauthLoading}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: 'var(--on-surface-variant)',
                        border: '2px solid var(--on-surface-variant)'
                      }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
}