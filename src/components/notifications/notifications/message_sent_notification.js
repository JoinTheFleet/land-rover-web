import Notification from '../notification';

export default class MessageSentNotification extends Notification {
  constructor(props) {
    super(props);

    let resources = props.notification.resources;

    this.state = {
      owner: resources.message.owner.instance,
      conversationID: resources.conversation_id
    };
  }

  sender() {
    let owner = this.state.owner;
    return `${owner.first_name} ${owner.last_name}`;
  }

  imageURL() {
    return this.state.owner.images.original_url;
  }

  linkData() {
    return {
      pathname: `/messages/${this.state.conversationID}`
    };
  }
}
