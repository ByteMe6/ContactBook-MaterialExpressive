import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchContacts, addContact, deleteContact, setFilter } from './redux/contactsSlice';
import { useNavigate } from "react-router-dom";

export default function Contacts() {
  const { items, isLoading, error } = useAppSelector(state => state.contacts.contacts);
  const filter = useAppSelector(state => state.contacts.filter);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [addError, setAddError] = useState('');

  // Load contacts on mount
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = items.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.phone.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddContact = async () => {
    // Reset previous error
    setAddError('');

    // Validation
    if (!newContactName.trim()) {
      setAddError('Please enter a contact name');
      return;
    }

    if (!newContactPhone.trim()) {
      setAddError('Please enter a phone number');
      return;
    }

    // Basic phone validation (optional)
    const phoneRegex = /^[+\d\s()-]+$/;
    if (!phoneRegex.test(newContactPhone)) {
      setAddError('Please enter a valid phone number');
      return;
    }

    const newContact = {
      name: newContactName.trim(),
      phone: newContactPhone.trim()
    };

    try {
      await dispatch(addContact(newContact)).unwrap();
      // Clear inputs on success
      setNewContactName('');
      setNewContactPhone('');
      setAddError('');
    } catch (err) {
      setAddError(err || 'Failed to add contact');
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Delete contact "${name}"?`)) {
      try {
        await dispatch(deleteContact(id)).unwrap();
      } catch (err) {
        alert(`Failed to delete contact: ${err}`);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // Clear authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Navigate to login
        navigate("/login");
      } catch (err) {
        console.error("Logout error:", err);
        alert("Failed to logout");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddContact();
    }
  };

  return (
      <main>
        <div className="header-actions">
          <h1>Contacts</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <button onClick={() => dispatch(fetchContacts())}>
          {isLoading ? 'Refreshing...' : 'Refresh Contacts'}
        </button>

        <input
            type="text"
            placeholder="Search contacts by name or phone..."
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
        />

        {isLoading && items.length === 0 && <p>Loading contacts...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!isLoading && items.length === 0 && !error && (
            <p className="empty-state">
              📱 No contacts yet. Add your first contact below!
            </p>
        )}

        {!isLoading && filteredContacts.length === 0 && items.length > 0 && (
            <p className="empty-state">
              🔍 No contacts match your search "{filter}"
            </p>
        )}

        <ul>
          {filteredContacts.map(contact => (
              <li key={contact.id}>
                <div>
                  <strong>{contact.name}</strong>
                  <br />
                  📞 {contact.phone}
                  {contact.createdAt && (
                      <small>
                        Added: {new Date(contact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      </small>
                  )}
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
              disabled={isLoading}
          />
          <input
              type="tel"
              className="addContInp"
              placeholder="Phone Number *"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
          />
          <button
              className="addContBtn"
              onClick={handleAddContact}
              disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </main>
  );
}