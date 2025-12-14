import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Fetch all contacts
export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/contacts/');
        console.log('📋 Contacts fetched:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Fetch contacts error:', error);
        const message = error.response?.data?.message
            || error.message
            || 'Failed to fetch contacts';
        return rejectWithValue(message);
      }
    }
);

// Add new contact
export const addContact = createAsyncThunk(
    'contacts/addContact',
    async (contact, { rejectWithValue }) => {
      try {
        console.log('➕ Adding contact:', contact);
        const response = await axiosInstance.post('/contacts/', contact);
        console.log('✅ Contact added:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Add contact error:', error);
        const message = error.response?.data?.message
            || error.message
            || 'Failed to add contact';
        return rejectWithValue(message);
      }
    }
);

// Update contact (optional, for future use)
export const updateContact = createAsyncThunk(
    'contacts/updateContact',
    async ({ id, ...updates }, { rejectWithValue }) => {
      try {
        console.log('✏️ Updating contact:', id, updates);
        const response = await axiosInstance.put(`/contacts/${id}`, updates);
        console.log('✅ Contact updated:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Update contact error:', error);
        const message = error.response?.data?.message
            || error.message
            || 'Failed to update contact';
        return rejectWithValue(message);
      }
    }
);

// Delete contact
export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (id, { rejectWithValue }) => {
      try {
        console.log('🗑️ Deleting contact:', id);
        await axiosInstance.delete(`/contacts/${id}`);
        console.log('✅ Contact deleted:', id);
        return id;
      } catch (error) {
        console.error('❌ Delete contact error:', error);
        const message = error.response?.data?.message
            || error.message
            || 'Failed to delete contact';
        return rejectWithValue(message);
      }
    }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: {
      items: [],
      isLoading: false,
      error: null,
    },
    filter: '',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.contacts.error = null;
    },
    clearContacts: (state) => {
      state.contacts.items = [];
      state.contacts.error = null;
      state.filter = '';
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
          state.contacts.items = Array.isArray(action.payload)
              ? action.payload
              : [];
          state.contacts.error = null;
        })
        .addCase(fetchContacts.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })

        // Add contact
        .addCase(addContact.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(addContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          // Add new contact to the beginning of the list
          state.contacts.items.unshift(action.payload);
          state.contacts.error = null;
        })
        .addCase(addContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })

        // Update contact
        .addCase(updateContact.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(updateContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          const index = state.contacts.items.findIndex(
              contact => contact.id === action.payload.id
          );
          if (index !== -1) {
            state.contacts.items[index] = action.payload;
          }
          state.contacts.error = null;
        })
        .addCase(updateContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })

        // Delete contact
        .addCase(deleteContact.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(deleteContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items = state.contacts.items.filter(
              contact => contact.id !== action.payload
          );
          state.contacts.error = null;
        })
        .addCase(deleteContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        });
  },
});

export const { setFilter, clearError, clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;