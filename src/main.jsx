import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store';
import App from './App';
import './App.css';

// 1. Визначте базовий шлях
// Приклад: якщо ваш репозиторій називається "ContactBook-MaterialExpressiveNew",
// то basename буде "/ContactBook-MaterialExpressiveNew"
const basename = "/ContactBook-MaterialExpressiveNew";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {/* 2. Передайте його до компонента BrowserRouter як властивість basename */}
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
);