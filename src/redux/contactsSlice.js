import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get, set, push, remove } from 'firebase/database';
import { db, auth } from '../firebase/firebase';

export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (_, { rejectWithValue }) => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const contactsRef = ref(db, `users/${user.uid}/contacts`);
        const snapshot = await get(contactsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert object to array with ids
          return Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        }
        return [];
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const addContact = createAsyncThunk(
    'contacts/addContact',
    async (contact, { rejectWithValue }) => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const contactsRef = ref(db, `users/${user.uid}/contacts`);
        const newContactRef = push(contactsRef);

        const contactData = {
          ...contact,
          createdAt: Date.now()
        };

        await set(newContactRef, contactData);

        return {
          id: newContactRef.key,
          ...contactData
        };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (contactId, { rejectWithValue }) => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const contactRef = ref(db, `users/${user.uid}/contacts/${contactId}`);
        await remove(contactRef);

        return contactId;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

// Slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: {
      items: [],
      isLoading: false,
      error: null
    },
    filter: ''
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearContacts: (state) => {
      state.contacts.items = [];
      state.contacts.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
        // Fetch contacts
        .addCase(fetchContacts.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(fetchContacts.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items = action.payload;
        })
        .addCase(fetchContacts.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })
        // Add contact
        .addCase(addContact.pending, (state) => {
          state.contacts.isLoading = true;
        })
        .addCase(addContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items.push(action.payload);
        })
        .addCase(addContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })
        // Delete contact
        .addCase(deleteContact.pending, (state) => {
          state.contacts.isLoading = true;
        })
        .addCase(deleteContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items = state.contacts.items.filter(
              contact => contact.id !== action.payload
          );
        })
        .addCase(deleteContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        });
  }
});

export const { setFilter, clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;