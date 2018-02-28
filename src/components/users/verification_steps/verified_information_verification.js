import React, { Component } from 'react';


export default class VerifiedInformationVerification extends Component {
  verified() {
    console.log('called')
    return false;
  }

  render() {
    console.log('rendering')
    return (<div>VerifiedInformationVerification</div>);
  }
}
