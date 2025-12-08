// FILE: src/main.jsx (ОНОВЛЕНО)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import App from './App';
import './App.css';

// Використовуємо базовий шлях, визначений у vite.config.js
const BASENAME = '/ContactBook-MaterialExpressive/';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {/* Встановлення basename тут дозволяє використовувати короткі шляхи у App.jsx */}
      <BrowserRouter basename={BASENAME}>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
);