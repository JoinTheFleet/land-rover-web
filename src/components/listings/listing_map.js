import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

class ListingMap extends Component {
  render() {
    let listings = this.props.listings;
    let lat = 0;
    let lng = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    let listing;

    for(let i = 0; i < listings.length; i++){
      listing = listings[i];
      lat = (listing.location.latitude) * Math.PI / 180;
      lng = (listing.location.longitude) * Math.PI / 180;

      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);

      sumX += x;
      sumY += y;
      sumZ += z;
    }

    let finalX = sumX / listings.length;
    let finalY = sumY / listings.length;
    let finalZ = sumZ / listings.length;

    let avgLng = (Math.atan2(finalY, finalX)) * 180 / Math.PI;
    let avgLat = (Math.atan2(finalZ, Math.sqrt(Math.pow(finalX,2) + Math.pow(finalY, 2)))) * 180 / Math.PI;

    console.log(avgLat);
    console.log(avgLng);

    return (
      <GoogleMap defaultZoom={10}
                 defaultCenter={{ lat: avgLat, lng: avgLng }}>
        {
          listings.map((listing, index) => {
            return <Marker key={'listing_map_item_' + (index + 1)} position={{ lat: listing.location.latitude, lng: listing.location.longitude }} />
          })
        }
      </GoogleMap>
    )
  }
}

export default withGoogleMap(ListingMap);
