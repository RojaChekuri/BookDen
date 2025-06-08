import '@visa/nova-styles/styles.css';
import '@visa/nova-styles/themes/visa-light/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);