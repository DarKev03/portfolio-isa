import { useState } from 'react';
import type { Language } from '../types/Language';

interface LanguageSelectorProps {
    onLanguageChange?: (language: Language) => void;
}

const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
    const [isSpanish, setIsSpanish] = useState(true);

    const selectLanguage = (language: Language) => {
        setIsSpanish(language === 'es');
        onLanguageChange?.(language);
    };

    return (
        <div className="flex flex-row gap-1 text-right text-md">
            <button className={`font-normal hover:underline cursor-pointer ${isSpanish ? '' : 'italic'}`} onClick={() => selectLanguage('en')}>
                EN
            </button>
            <p className="font-normal">/</p>
            <button className={`font-normal hover:underline cursor-pointer ${isSpanish ? 'italic' : ''}`} onClick={() => selectLanguage('es')}>
                ES
            </button>
        </div>
    );
}
export default LanguageSelector;