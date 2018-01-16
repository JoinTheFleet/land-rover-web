import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';

class GoogleTagManager extends Component {
  constructor(props) {
    super(props);

    this.gtag = this.gtag.bind(this);
    this.initializeGTM = this.initializeGTM.bind(this);
    this.tagLocation = this.tagLocation.bind(this);
  }

  gtag() {
    if (window.dataLayer) {
      window.dataLayer.push(arguments);
    }
  }

  initializeGTM() {
    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.tagLocation();
  }

  tagLocation() {
    this.gtag('config', this.props.gtmID, {
      'page_location': window.location.origin,
      'page_path': window.location.pathname
    });
  }

  componentDidMount() {
    const tagScript = document.createElement('script');
    tagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.props.gtmID}`;
    tagScript.async = true;
    tagScript.onload = this.initializeGTM;
    document.head.appendChild(tagScript);
  
    this.props.history.listen(this.tagLocation);
  }

  render() {
    return <div></div>;
  }
}

GoogleTagManager.propTypes = {
  gtmID: propTypes.string.isRequired
}

export default withRouter(GoogleTagManager)