import { useState } from 'react';

const LanguageSelector = () => {
    const [isSpanish, setIsSpanish] = useState(true);

    return (
        <div className="flex flex-row gap-1">
            <button className={`font-normal hover:underline cursor-pointer ${isSpanish ? '' : 'italic'}`} onClick={() => setIsSpanish(false)}>
                EN
            </button>
            <p className="font-normal">/</p>
            <button className={`font-normal hover:underline cursor-pointer ${isSpanish ? 'italic' : ''}`} onClick={() => setIsSpanish(true)}>
                ES
            </button>
        </div>
    );
}
export default LanguageSelector;