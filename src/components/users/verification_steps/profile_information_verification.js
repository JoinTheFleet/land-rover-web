import React, { Component } from 'react';


export default class ProfileInformationVerification extends Component {
  verified() {
    console.log('called')
    return false;
  }

  render() {
    console.log('rendering')
    return (<div>ProfileInformationVerification</div>);
  }
}
