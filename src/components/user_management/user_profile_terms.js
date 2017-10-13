import React, {
  Component
} from 'react';

export default class UserProfileTerms extends Component {
  constructor(props) {
    super(props);
  }

  getViewToRender() {
    let viewToRender = 'T';

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
