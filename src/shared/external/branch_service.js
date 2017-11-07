import LocalizationService from '../libraries/localization_service';
import UsersService from '../services/users/users_service';
import ConfigurationService from '../services/configuration_service';
import branch from 'branch-sdk';
import moment from 'moment';

export default class BranchService {
  static userReferralLink(user, social, resolve, reject) {
    return branch.link({
      data: {
        '$og_title': social.title,
        '$canonical_identifier': `referral_${user.id}_${moment().unix()}`,
        '$og_description': social.details,
        '$og_image_url': social.image_url,
        '$desktop_url': process.env.REACT_APP_HOST_URL + '/referral/' + user.referral_code,
        '$referral_code': user.referral_code
      }
    }, (error, link) => {
      if (error) {
        reject(error);
      }
      else if (link) {
        resolve(link);
      }
    });
  }

  static referralLink(user, configuration) {
    return new Promise((resolve, reject) => {
      if (!configuration) {
        ConfigurationService.show()
                            .then(response => {
                              configuration = response.data.data.configuration;
                              let social = configuration.bonuses.referral.social;

                              return this.userReferralLink(user, social, resolve, reject);
                            })
                            .catch(error => {
                              reject(error.response.data.message);
                            })
      }
      else {
        let social = configuration.bonuses.referral.social;

        return this.userReferralLink(user, social, resolve, reject);
      }
    })
  }
}
