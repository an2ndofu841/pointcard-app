import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // CSS読み込み追加

const root = createRoot(document.getElementById('root'));
root.render(<App />);
