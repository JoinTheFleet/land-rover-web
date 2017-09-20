import React, { Component } from 'react'

class ListingItem extends Component {

  renderItem(){
    let item = this.props.listing;
    let image;

    if(item.gallery.length > 0) {
      image = <img src={item.gallery[0].images.small_url}></img>;
    }

    return image
  }

  render () {
    return (
      <div> { this.renderItem() } </div>
    )
  }
}

export default ListingItem;
