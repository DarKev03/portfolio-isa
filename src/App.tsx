import AppRouter from './routes/AppRouter';
import { LanguageProvider } from './i18n/LanguageProvider';

function App() {
  return <LanguageProvider><AppRouter /></LanguageProvider>;
}

export default App;
