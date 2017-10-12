import { injectIntl } from 'react-intl';
import { IntlProvider } from 'react-intl';
import acceptLanguage from 'accept-language';
import Cookies from "universal-cookie";

import localeData from '../../locales/locales.json';

acceptLanguage.languages(['en']); // Add more languages later on

const cookies = new Cookies();
const language = cookies.get('userLocale') || ((navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage);

const messages = localeData[language] || localeData.en;
const locale = acceptLanguage.get(language);

const { intl } = new IntlProvider({
  locale: locale,
  messages: localeData[language] || localeData.en,
}, { }).getChildContext();

class LocalizationService {
  static formatMessage(id, params) {
    if (!params) {
      params = {};
    }

    return intl.formatMessage({
      id: id
    }, params);
  }
}

export default LocalizationService
