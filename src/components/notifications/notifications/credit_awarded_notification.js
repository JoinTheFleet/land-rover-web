import Notification from '../notification';

export default class CreditAwardedNotification extends Notification {
  constructor(props) {
    super(props);

    let resources = props.notification.resources;

    this.state = {
      creditor: resources.credit_record.creditor,
      creditorType: resources.credit_record.creditor_type
    }
  }

  sender() {
    let creditor = this.state.creditor;

    if (this.state.creditorType.toLowerCase() === 'platform') {
      return creditor.name;
    }
    else {
      return super.sender();
    }
  }

  linkData() {
    return {
      pathname: `/profile/credits`
    };
  }
}
