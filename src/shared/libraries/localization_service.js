import { IntlProvider } from 'react-intl';

import localeData from '../../locales/locales.json';

const { intl } = new IntlProvider({
  locale: 'en',
  messages: localeData.en,
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
