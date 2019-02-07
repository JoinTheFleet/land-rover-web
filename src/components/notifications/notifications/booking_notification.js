import Notification from '../notification';

export default class BookingNotification extends Notification {
  constructor(props) {
    super(props);

    let resources = props.notification.resources;
    let booking = resources.booking;
    let sender = booking.renter;
    let targetMode = resources.target_mode;
    let owner = booking.listing.user;
    let vendorLocation = owner.vendor_location;
    
    if (targetMode === 'owner') {
      sender = booking.listing.user;
    }

    this.state = {
      booking: booking,
      sender: sender,
      targetMode: targetMode,
      vendorLocation: vendorLocation
    };
  }

  imageURL() {
    if (this.state.targetMode === 'renter' && this.state.vendorLocation) {
      return this.state.vendorLocation.images.original_url;
    }

    return this.state.sender.images.original_url;
  }

  sender() {
    let sender = this.state.sender;

    if (this.state.targetMode === 'renter' && this.state.vendorLocation) {
      return this.state.vendorLocation.name;
    }

    return sender.first_name;
  }

  linkData() {
    return {
      state: {
        targetMode: this.state.targetMode
      },
      pathname: `/bookings/${this.state.booking.id}`
    };
  }
}
