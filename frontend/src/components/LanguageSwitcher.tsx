import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Globe } from 'lucide-react'

interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const currentLanguage = useMemo(
    () => languages.find((lang) => lang.code === i18n.language) || languages[0],
    [i18n.language]
  )

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <div className="relative group">
      <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <svg
          className="h-4 w-4 transition-transform group-hover:rotate-180 duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      <div className="absolute right-0 z-50 mt-2 hidden w-64 rounded-lg border border-slate-200 bg-white shadow-xl group-hover:block backdrop-blur-sm">
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full rounded-md px-3 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                i18n.language === lang.code
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-900 border-l-4 border-blue-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-semibold">{lang.nativeName}</div>
                <div className="text-xs text-slate-500">{lang.name}</div>
              </div>
              {i18n.language === lang.code && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LanguageSwitcher
