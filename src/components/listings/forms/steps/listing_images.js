import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import noImagesIcon from '../../../../assets/images/placeholder-no-images.png';

import S3Uploader from '../../../../shared/external/s3_uploader';
import Helpers from '../../../../miscellaneous/helpers';

import ListingImagesService from '../../../../shared/services/listings/listing_images_service';
import LocalizationService from '../../../../shared/libraries/localization_service';

import ListingStep from './listing_step';
import ListingFormFieldGroup from '../listing_form_field_group';
import ImageGallery from '../../../miscellaneous/image_gallery';
import Loading from '../../../miscellaneous/loading';

const MINIMUM_IMAGE_COUNT = 3;

export default class ListingImages extends Component {
  constructor(props) {
    super(props);

    let listing = this.props.listing;
    let images = [];

    if (listing.gallery) {
      images = listing.gallery.map(galleryImage => {
        return { url: galleryImage.images.original_url, id: galleryImage.id };
      });
    }

    this.state = {
      images: images,
      loading: false
    };

    this.validateFields = this.validateFields.bind(this);
    this.requiredImagesText = this.requiredImagesText.bind(this);
    this.getListingProperties = this.getListingProperties.bind(this);
    this.addUploadedImage = this.addUploadedImage.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleImagesUpload = this.handleImagesUpload.bind(this);
    this.readUploadedImages = this.readUploadedImages.bind(this);
    this.handleUploadImagesButtonClick = this.handleUploadImagesButtonClick.bind(this);
    this.handleImageUpdateResponse = this.handleImageUpdateResponse.bind(this);
  }

  componentDidMount() {
    this.setupImagesDrop();

    window.addEventListener("dragover",function(event){
      event.preventDefault();
    },false);

    window.addEventListener("drop",function(event){
      event.preventDefault();
    },false);
  }

  validateFields() {
    return this.state.images.length >= MINIMUM_IMAGE_COUNT;
  }

  getListingProperties() {
    return { images: this.state.images };
  }

  requiredImagesText() {
    let requiredCount = Math.max(0, MINIMUM_IMAGE_COUNT - this.state.images.length);

    if (requiredCount > 0) {
      return ` (${requiredCount} ${LocalizationService.formatMessage('listings.images.more_images_required')})`;
    }
    else {
      return '';
    }
  }

  setupImagesDrop() {
    document.getElementsByClassName('listing-form-images')[0].addEventListener('drop', (event) => {
      let files = event.dataTransfer.files;
      let numberOfImagesToAdd = files.length;
      let imagesToAdd = [];

      if (numberOfImagesToAdd > 0) {
        this.setState({ loading: true }, () => {
          this.readUploadedImages(files, imagesToAdd, numberOfImagesToAdd);
        });
      }
    }, true);
  }

  handleUploadImagesButtonClick() {
    document.getElementById('listing_images_uploaded_input').click();
  }

  handleImagesUpload(fileInput) {
    let files = fileInput.files;
    let numberOfImagesToAdd = files.length;
    let imagesToAdd = [];

    if (numberOfImagesToAdd > 0) {
      this.setState({ loading: true }, () => {
        this.readUploadedImages(files, imagesToAdd, numberOfImagesToAdd);
      });
    }
  }

  readUploadedImages(files, imagesToAdd, numberOfImagesToAdd) {
    for(let i = 0; i < files.length; i++) {
      if (files[i].size >= 5000000) {
        this.setState({
          loading: false
        }, () => {
          Alert.error(LocalizationService.formatMessage('listings.images.maximum_file_size'));
        });
      }
      else if (!files[i].type.startsWith("image/")) {
        this.setState({
          loading: false
        }, () => {
          Alert.error(LocalizationService.formatMessage('listings.images.invalid_type'));
        });
      }
      else {
        S3Uploader.upload(files[i], 'listing_image')
                .then(response => {
                  this.addUploadedImage(response.Location, imagesToAdd, numberOfImagesToAdd);
                })
                .catch(error => {

                });
      }
    }
  }

  addUploadedImage(image, imagesToAdd, numberOfImagesToAdd) {
    if (this.state.images.indexOf(image) < 0) {
      imagesToAdd.push({ url: image });
    }
    else {
      numberOfImagesToAdd--;
    }

    if (this.props.edit) {
      ListingImagesService.create(this.props.listing.id, image)
                          .then(this.handleImageUpdateResponse)
                          .catch(error => {
                            Alert.error(error.response.data.message);
                          });
    }
    else {
      if ( imagesToAdd.length === numberOfImagesToAdd ) {
        this.setState((prevState) => ({
          loading: false,
          images: prevState.images.concat(imagesToAdd)
        }));
      }
    }
  }

  handleRemoveImage(image) {
    let images = this.state.images;
    let index = images.findIndex(currentImage => currentImage.url === image);

    if (index >= 0) {
      let existingObject = images[index];

      if (this.props.edit) {
        ListingImagesService.destroy(this.props.listing.id, existingObject.id)
                            .then(this.handleImageUpdateResponse)
                            .catch(error => {
                              Alert.error(error.response.data.message);
                            });
      }
      else {
        images.splice(index, 1);
        this.setState({ images: images });
      }      
    }
  }

  handleImageUpdateResponse(response) {
    this.setState({ 
      loading: false,
      images: response.data.data.images.map(galleryImage => {
        return { url: galleryImage.images.original_url, id: galleryImage.id };
      })
    });
    Alert.success(LocalizationService.formatMessage('listings.image_updated'))
  }

  renderImagesCarousel() {
    let imagesCarousel = (
      <div className="images-carousel-empty-div">
        <img src={ noImagesIcon } alt="no_images" />
      </div>
    )

    if ( this.state.loading ) {
      imagesCarousel = (
        <Loading />
      )
    }

    else if ( this.state.images.length > 0 ) {
      imagesCarousel = (
        <div className="images-carousel">
          <ImageGallery images={ this.state.images.map(image => image.url) }
                        showRemoveButton={ true }
                        handleRemoveImage={ this.handleRemoveImage } />
        </div>
      );
    }

    return imagesCarousel;
  }

  render() {
    return (
      <div className="listing-form-images text-center activecol-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 no-side-padding">
        <ListingStep validateFields={ this.validateFields }
                     getListingProperties={ this.getListingProperties }
                     handleProceedToStepAndAddProperties={ this.props.handleProceedToStepAndAddProperties }
                     listing={ Helpers.extendObject(this.props.listing, this.getListingProperties()) } >
          <ListingFormFieldGroup title={ LocalizationService.formatMessage('listings.images.vehicle_images') + this.requiredImagesText() }>
            { this.renderImagesCarousel() }
            <button className="listing-form-images-upload-btn btn secondary-color white-text fs-12 ls-dot-five col-xs-12"
                    onClick={ (event) => { event.preventDefault(); this.handleUploadImagesButtonClick() } }>
              <FormattedMessage id="listings.images.upload_vehicle_images" />
            </button>

            <input type="file"
                   id="listing_images_uploaded_input"
                   className="hide"
                   multiple={ true }
                   accept="image/*"
                   onChange={ (event) => { this.handleImagesUpload(event.target) } } />
          </ListingFormFieldGroup>
        </ListingStep>
      </div>
    )
  }
}

ListingImages.propTypes = {
  handleProceedToStepAndAddProperties: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired
}
