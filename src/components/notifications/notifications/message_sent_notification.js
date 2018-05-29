import Notification from '../notification';

export default class MessageSentNotification extends Notification {
  constructor(props) {
    super(props);

    let resources = props.notification.resources;

    this.state = {
      renterMode: resources.target_mode === 'renter',
      owner: resources.message.owner.instance,
      conversationID: resources.conversation_id
    };
  }

  sender() {
    let owner = this.state.owner;

    if (owner.vendor_location && this.state.renterMode) {
      return owner.vendor_location.name;
    }

    return owner.first_name;
  }

  imageURL() {
    let owner = this.state.owner;

    if (owner.vendor_location && this.state.renterMode) {
      return owner.vendor_location.images.small_url;
    }

    return this.state.owner.images.original_url;
  }

  linkData() {
    return {
      pathname: `/messages/${this.state.conversationID}`
    };
  }
}
