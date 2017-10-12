import React, {
  Component
} from 'react';

import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import PropTypes from 'prop-types';

import noImagesIcon from '../../../../assets/images/placeholder-no-images.png';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';

class ListingImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: []
    };

    this.validateFields = this.validateFields.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
  }

  validateFields() {
    return this.getListingProperties().images.length > 0;
  }

  getListingProperties() {
    return { images: this.state.images }
  }

  renderImagesCarousel() {
    let imagesCarousel = (
      <div className="images-carousel-empty-div">
        <img src={noImagesIcon} alt="no_images" />
      </div>
    )

    if ( this.state.images.length > 0 ) {
      imagesCarousel = (<div></div>); //TODO: Create a component for images carousel
    }

    return imagesCarousel;
  }

  render() {
    return (
      <div className="listing-form-images text-center activecol-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     intl={ this.props.intl }>
          <ListingFormFieldGroup title={ this.props.intl.formatMessage({id: 'listings.images.vehicle_images'}) }>
            { this.renderImagesCarousel() }
            <button className="listing-form-images-upload-btn btn secondary-color white-text fs-12 ls-dot-five col-xs-12">
              <FormattedMessage id="listings.images.upload_vehicle_images" />
            </button>
          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

export default injectIntl(ListingImages);

ListingImages.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object
}
