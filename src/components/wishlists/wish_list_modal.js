import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import LocalizationService from '../../shared/libraries/localization_service';
import WishListsService from '../../shared/services/wish_lists_service';

import Modal from '../miscellaneous/modal';
import FormField from '../miscellaneous/forms/form_field';

export default class WishListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wishLists: [],
      searchTimeout: undefined,
      wishList: undefined,
      loading: false
    };

    this.handleWishListChange = this.handleWishListChange.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  convertResponseToOptions(response) {
    let wishLists = response.data.data.wish_lists;

    return {
      options: wishLists.map((wishList) => {
        return {
          value: wishList.id,
          label: wishList.name
        };
      })
    }
  }

  loadOptions(input) {
    if (!input) {
      this.setState({ loading: true })
      return WishListsService.index()
                             .then(response => {
                               this.setState({ loading: false });

                               return this.convertResponseToOptions(response);
                             });
    }
    else {
      this.setState({ loading: true });

      return WishListsService.search(input)
                             .then(response => {
                               this.setState({ loading: false });
                              
                               return this.convertResponseToOptions(response);
                             });
    }
  }

  handleWishListChange(wishList) {
    if (wishList && wishList.value) {
      this.setState({
        wishList: wishList,
        disabled: true,
        loading: true
      }, () => {
        if (isNaN(wishList.value)) {
          WishListsService.create(wishList.value)
                          .then(response => {
                            let wishList = response.data.data.wish_list;
                            
                            this.addListingToWishList(wishList.id);
                          })
        }
        else {
          this.addListingToWishList(wishList.value);
        }
      })
    }
  }

  addListingToWishList(wishListID) {
    let options = {
      listingID: this.props.listing.id,
      wishListID: wishListID
    }
    WishListsService.addListing(wishListID, this.props.listing.id)
                    .then(response => {
                      this.setState({
                        loading: false,
                        wishList: undefined
                      }, () => {
                        Alert.success(LocalizationService.formatMessage('wish_lists.successfully_added'));
                        this.props.toggleModal();
                        this.props.eventEmitter.emit('ADDED_LISTING_WISHLIST', options)
                      });
                    })
                    .catch(error => {
                      Alert.error(error.response.data.message);
                      this.props.toggleModal();
                      this.setState({
                        wishList: undefined
                      });
                    })
  }

  promptTextCreator(label) {
    return LocalizationService.formatMessage('wish_lists.create', { label: label });
  }

  render() {
    return (
      <Modal open={ this.props.open }
             title={ LocalizationService.formatMessage('wish_lists.save_to_wishlist') }
             toggleModal={ this.props.toggleModal } >
        <div className='row'>
          <div className='col-xs-12 wishlist-selector'>
            <FormField type='select-create-async'
                       id='wishlist-modal-select'
                       value={ this.state.wishList }
                       handleChange={ this.handleWishListChange }
                       clearable={ false }
                       loading={ this.state.loading }
                       loadOptions={ this.loadOptions }
                       promptTextCreator={ this.promptTextCreator } />
          </div>
        </div>
      </Modal>
    )
  }
}

WishListModal.propTypes = {
  open: PropTypes.bool,
  toggleModal: PropTypes.func,
  listing: PropTypes.object.isRequired
};
