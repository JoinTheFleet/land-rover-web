import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';

import Slider from 'react-slick';

import Helpers from '../../miscellaneous/helpers';

import closeIcon from '../../assets/images/close_cancel.png';
import noImagesPlaceholder from '../../assets/images/placeholder-no-images.png';

const DEFAULT_NUMBER_SLIDES_TO_SHOW = 1;
const DEFAULT_NUMBER_SLIDES_TO_SCROLL = 1;

export default class ImageGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: props.images || []
    };
  }

  render() {

    // Thanks to the extendObject method, all properties defined in this.props will take precendence over the default ones.
    let sliderSettings = Helpers.extendObject({
      dots: this.state.images.length > 0,
      infinite: false,
      speed: 500,
      slidesToShow: DEFAULT_NUMBER_SLIDES_TO_SHOW,
      slidesToScroll: DEFAULT_NUMBER_SLIDES_TO_SCROLL
    }, this.props);

    let closeButton;

    return (
      <div className="fleet-image-gallery">
        <Slider {...sliderSettings}>
          {
            this.state.images.map((image, index) => {
              closeButton = '';

              if (this.props.showRemoveButton) {
                closeButton = (<img src={ closeIcon } alt="close_icon" className="fleet-image-gallery-remove-icon" onClick={ () => { this.props.handleRemoveImage(image) } } />)
              }

              return (
                <div key={ 'gallery_image_' + index } >
                  <img src={ image } alt="gallery_image" onError={() => {
                    const images = this.state.images;
                    images[index] = noImagesPlaceholder;

                    this.setState({ images: images });
                  } } />
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
  handleRemoveImage: PropTypes.func
};
