import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchContacts, addContact, deleteContact, setFilter } from './redux/contactsSlice';
import { signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Contacts() {
  const { items, isLoading, error } = useAppSelector(state => state.contacts.contacts);
  const filter = useAppSelector(state => state.contacts.filter);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Load contacts on mount
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = items.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      const newContact = {
        name: newContactName,
        phone: newContactPhone
      };

      dispatch(addContact(newContact));
      setNewContactName('');
      setNewContactPhone('');
    } else {
      alert('Please fill in both name and phone!');
    }
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch(deleteContact(id));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout");
    }
  };

  return (
      <main>
        <div className="header-actions">
          <h1>Contacts</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <button onClick={() => dispatch(fetchContacts())}>
          Refresh Contacts
        </button>

        <input
            type="text"
            placeholder="Search contacts..."
            value={filter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
        />

        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!isLoading && items.length === 0 && !error && (
            <p className="empty-state">No contacts yet. Add your first contact below!</p>
        )}

        <ul>
          {filteredContacts.map(contact => (
              <li key={contact.id}>
                <div>
                  <strong>{contact.name}</strong>
                  <br />
                  {contact.phone}
                  <small>Added: {new Date(contact.createdAt).toLocaleDateString()}</small>
                </div>
                <button onClick={() => handleDeleteContact(contact.id)}>
                  Delete
                </button>
              </li>
          ))}
        </ul>

        <div className="addCont">
          <h3>Add New Contact</h3>
          <input
              type="text"
              className="addContInp"
              placeholder="Name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
          />
          <input
              type="text"
              className="addContInp"
              placeholder="Phone"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
          />
          <button className="addContBtn" onClick={handleAddContact}>
            Add Contact
          </button>
        </div>
      </main>
  );
}