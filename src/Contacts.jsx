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
        navigate("/login");
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

  if (isLoading) {
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

      </>
  );
}