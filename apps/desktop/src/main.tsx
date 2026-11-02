import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/josefin-sans/300.css';
import './styles/app.css';
import './styles/modal.css';
import { CvProvider } from './state';
import { DocumentProvider } from './document';
import { I18nProvider } from './i18n';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CvProvider>
      <I18nProvider>
        <DocumentProvider>
          <App />
        </DocumentProvider>
      </I18nProvider>
    </CvProvider>
  </StrictMode>,
);
