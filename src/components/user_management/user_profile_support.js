import React, {
  Component
} from 'react';

export default class UserProfileSupport extends Component {
  getViewToRender() {
    let viewToRender = 'S';

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
