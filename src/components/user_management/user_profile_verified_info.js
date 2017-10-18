import React, {
  Component
} from 'react';

export default class UserProfileVerifiedInfo extends Component {
  getViewToRender() {
    let viewToRender = 'VI';

    return viewToRender;
  }

  render() {
    return (
      <div className="col-xs-12 no-side-padding">
        { this.getViewToRender() }
      </div>
    )
  }
}
