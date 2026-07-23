import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import hiTranslation from './locales/hi/translation.json'
import teTranslation from './locales/te/translation.json'
import taTranslation from './locales/ta/translation.json'
import knTranslation from './locales/kn/translation.json'
import mlTranslation from './locales/ml/translation.json'
import mrTranslation from './locales/mr/translation.json'
import bnTranslation from './locales/bn/translation.json'

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  te: { translation: teTranslation },
  ta: { translation: taTranslation },
  kn: { translation: knTranslation },
  ml: { translation: mlTranslation },
  mr: { translation: mrTranslation },
  bn: { translation: bnTranslation },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
