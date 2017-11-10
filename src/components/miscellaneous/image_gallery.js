import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Slider from 'react-slick';

import Helpers from '../../miscellaneous/helpers';

import closeIcon from '../../assets/images/close_cancel.png';

const DEFAULT_NUMBER_SLIDES_TO_SHOW = 1;
const DEFAULT_NUMBER_SLIDES_TO_SCROLL = 1;

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);

    this.handleErrorSRC = this.handleErrorSRC.bind(this);
  }
  
  handleErrorSRC(event) {
    if (this.props.errorSRC && event) {
      event.target.setAttribute('src', this.props.errorSRC);
    }
  }

  render() {

    // Thanks to the extendObject method, all properties defined in this.props will take precendence over the default ones.
    let sliderSettings = Helpers.extendObject({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: DEFAULT_NUMBER_SLIDES_TO_SHOW,
      slidesToScroll: DEFAULT_NUMBER_SLIDES_TO_SCROLL
    }, this.props);

    let closeButton;

    return (
      <div className="fleet-image-gallery">
        <Slider {...sliderSettings}>
          {
            this.props.images.map((image, index) => {
              closeButton = '';

              if (this.props.showRemoveButton) {
                closeButton = (<img src={ closeIcon } alt="close_icon" className="fleet-image-gallery-remove-icon" onClick={ () => { this.props.handleRemoveImage(image) } } />)
              }

              return (
                <div key={ 'gallery_image_' + index } >
                  <img src={ image } alt="gallery_image" onError={ this.handleErrorSRC } />
                  { closeButton }
                </div>
              )
            })
          }
        </Slider>
      </div>
    );
  }
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  showRemoveButton: PropTypes.bool,
  handleRemoveImage: PropTypes.func,
  errorSRC: PropTypes.string
};
