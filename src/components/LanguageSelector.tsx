import { useLanguage } from '../i18n/languageContext';

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    return (
        <div className="flex flex-row gap-1 text-right text-md">
            <button type="button" lang="en" aria-pressed={language === 'en'} className={`font-normal hover:underline cursor-pointer ${language === 'en' ? 'italic' : ''}`} onClick={() => setLanguage('en')}>
                EN
            </button>
            <p className="font-normal">/</p>
            <button type="button" lang="es" aria-pressed={language === 'es'} className={`font-normal hover:underline cursor-pointer ${language === 'es' ? 'italic' : ''}`} onClick={() => setLanguage('es')}>
                ES
            </button>
        </div>
    );
}
export default LanguageSelector;