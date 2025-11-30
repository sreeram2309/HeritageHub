import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

// --- IMPORTANT STYLES ---
import '@mantine/core/styles.css'; // <--- This fixes the invisible components!
import 'leaflet/dist/leaflet.css'; // This fixes the map
import './index.css';
import '@mantine/carousel/styles.css'; 

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
