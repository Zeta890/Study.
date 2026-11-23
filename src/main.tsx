import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './lib/store';
import { SAMPLE_QUESTIONS } from './lib/bank';
import { SELECON_INEDITAS } from './lib/bank-selecon';

// Banco inicial: exemplos do app + 60 questões inéditas enviadas pelo usuário (não oficiais).
const BANK = [...SAMPLE_QUESTIONS, ...SELECON_INEDITAS];
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider bank={BANK}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
