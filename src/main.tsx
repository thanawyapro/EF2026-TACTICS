import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n'; // Bootstrap i18next configurations
import { ThemeProvider } from './theme/ThemeProvider';
import { runI18nAudit } from './lib/i18nAudit';

// Trigger the internal translation audit
runI18nAudit();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
