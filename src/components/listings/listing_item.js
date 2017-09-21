import React, { Component } from 'react'

class ListingItem extends Component {

  renderItem(){
    let item = this.props.listing;
    let image;

    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTrim = item.variant.trim;
    let vehicleTitle = vehicleMake + ' ' + vehicleModel + ' - ' + vehicleTrim;

    if(item.gallery.length > 0) {
      image = <img src={item.gallery[0].images.large_url} alt={vehicleTitle}></img>;
    }

    return (
      <div>
        { image }
        <p>
          <span>{ vehicleTitle }</span>
        </p>
      </div>
    )
  }

  render () {
    return (
      <div> { this.renderItem() } </div>
    )
  }
}

export default ListingItem;
