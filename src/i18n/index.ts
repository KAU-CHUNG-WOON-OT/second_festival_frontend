import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import koCommon from './locales/ko/common.json'
import enCommon from './locales/en/common.json'

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    ko: { common: koCommon },
    en: { common: enCommon },
  },
  fallbackLng: 'ko',
  supportedLngs: ['ko', 'en'],
  ns: ['common'],
  defaultNS: 'common',
  detection: {
    order: ['localStorage'],
    caches: ['localStorage'],
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n