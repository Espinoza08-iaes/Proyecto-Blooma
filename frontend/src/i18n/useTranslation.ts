import { useMemo } from 'react';
import { translations, type SupportedLanguage, type TranslationDictionary } from './translations';
import { type Profile } from '../db/db';

export function useTranslation(target?: Profile | SupportedLanguage | null): {
  t: TranslationDictionary;
  language: SupportedLanguage;
} {
  const language: SupportedLanguage = useMemo(() => {
    if (typeof target === 'string') {
      if (target === 'es' || target === 'miskito' || target === 'creole') {
        return target;
      }
    } else if (target && typeof target === 'object' && target.language) {
      if (target.language === 'es' || target.language === 'miskito' || target.language === 'creole') {
        return target.language;
      }
    }
    return 'es';
  }, [target]);

  const t = useMemo(() => {
    return translations[language] || translations.es;
  }, [language]);

  return { t, language };
}
