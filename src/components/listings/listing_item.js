import React, { Component } from 'react'
import RatingInput from '../miscellaneous/rating_input'

class ListingItem extends Component {

  renderItem(){
    let item = this.props.listing;
    let image;

    let vehicleMake = item.variant.make.name;
    let vehicleModel = item.variant.model.name;
    let vehicleTitle = vehicleMake + ', ' + vehicleModel;

    if(item.gallery.length > 0) {
      image = <img src={item.gallery[0].images.original_url} alt={vehicleTitle}></img>;
    }

    return (
      <div>
        <div className="listing-item-photo-and-title">
          { image }
          <div className="listing-item-title fs-16px">
            <span className="subtitle-font-weight">{ vehicleTitle }</span>
            <span className="listing-item-year">{ item.variant.year.year }</span>
          </div>
        </div>
        <div className="listing-item-info">
          <div>
            { '€' + (item.price / 100) + ' per day' }
          </div>
          <RatingInput rating={4} inputNameSufix={item.id} readonly={true} />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="listing-item col-xs-12 col-md-6"> { this.renderItem() } </div>
    )
  }
}

export default ListingItem;
