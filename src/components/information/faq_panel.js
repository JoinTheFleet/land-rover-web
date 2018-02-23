import React, { Component } from 'react';
import LocalizationService from '../../shared/libraries/localization_service';

export default class FAQPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className={ `panel ${this.props.panelClass || "panel-default" }` }>
        <div className="panel-heading" role="tab" onClick={ this.toggle }>
          <h4 className="panel-title">
            { LocalizationService.formatMessage(`${this.props.faqPrefix}${this.props.id}_title`) }
            <span className='pull-right caret' />
          </h4>
        </div>
        <div className={ `panel-collapse ${this.state.open ? '' : 'collapse'} `}>
          <div className="panel-body" dangerouslySetInnerHTML={{__html: LocalizationService.formatMessage(`${this.props.faqPrefix}${this.props.id}_text`) }} />
        </div>
      </div>
    );
  }
}