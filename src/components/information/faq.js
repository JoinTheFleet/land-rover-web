import React, { Component } from 'react';
import FAQPanel from './faq_panel';

export default class FAQ extends Component {
  render() {
    let faqs = [];

    for(let i = 1; i <= this.props.faqCount; i++) {
      faqs.push(<FAQPanel {...this.props} id={ i } />);
    }

    return (
      <div className='col-xs-12 no-side-padding faq'>
        <div className='title'>
          { this.props.title }
        </div>
        <div className='faqs col-xs-12 col-xs-offset-0 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2'>
          <div className="panel-group">
            { faqs }
          </div>
        </div>
      </div>
    );
  }
}
