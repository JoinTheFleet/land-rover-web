import React, {
  Component
} from 'react';

export default class UserProfileSettings extends Component {

  getViewToRender() {
    let viewToRender = 'SE';

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
