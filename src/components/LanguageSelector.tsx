// Language Selector Component
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  className?: string;
}

export function LanguageSelector({ variant = 'dropdown', className = '' }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('kilolab-lang', code);
    setIsOpen(false);
  };

  // Minimal variant - just flag
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 p-2 hover:bg-slate-100 rounded-lg transition-all"
          aria-label="Change language"
        >
          <span className="text-xl">{currentLang.flag}</span>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-all ${
                  currentLang.code === lang.code ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {currentLang.code === lang.code && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Buttons variant - side by side
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentLang.code === lang.code
                ? 'bg-teal-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
      >
        <Globe size={16} className="text-slate-500" />
        <span className="text-sm font-medium text-slate-700">{currentLang.flag} {currentLang.name}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-all ${
                currentLang.code === lang.code ? 'bg-teal-50' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className={`font-medium ${currentLang.code === lang.code ? 'text-teal-700' : 'text-slate-700'}`}>
                {lang.name}
              </span>
              {currentLang.code === lang.code && <Check size={16} className="ml-auto text-teal-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
