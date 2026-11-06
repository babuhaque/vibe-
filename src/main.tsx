import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorkerManager';

// Register Service Worker for offline resilience and background appointment notifications
registerServiceWorker().catch((err) => {
  console.warn('SW registration failed on boot:', err);
});

createRoot(document.getElementById('root')!).render(<App />);
