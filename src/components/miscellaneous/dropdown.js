import React, {
  Component
} from 'react';

import PropTypes from 'prop-types';
import Toggleable from '../miscellaneous/toggleable';

import dropdownIcon from '../../assets/images/dropdown.png';
import dropdownOpenIcon from '../../assets/images/dropdown_open.png';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSelectedItem: null,
      open: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState((prevState) => ( { open: !prevState.open } ));
  }

  handleItemClick(item) {
    let name = this.props.name;

    this.setState({
      currentSelectedItem: item,
      open: 'false' // TODO: check what's wrong with this (doesn't work with boolean false value)
    }, () => {

      if(this.props.itemClickHandler) {
        if (name) {
          this.props.itemClickHandler(name, item);
        }
        else {
          this.props.itemClickHandler(item);
        }
      }
    });
  }

  render() {
    let currentItemText = this.props.placeholder;
    currentItemText += this.state.currentSelectedItem ? (': ' + this.state.currentSelectedItem) : '';

    return (
      <div className="fleet-dropdown">
        <div className="currentSelectedItem" onClick={ () => { this.toggleDropdown() } }>
          <span className={ this.state.currentSelectedItem ? 'subtitle-font-weight' : '' } >{ currentItemText }</span>
          <img src={ this.state.open ? dropdownOpenIcon : dropdownIcon } alt="dropdown_icon" />

          <Toggleable open={ this.state.open } duration={ 250 } >
            <div className="dropdown-items">
              <ul>
                {
                  this.props.items.map((item, index) => {
                    return (<li className="dropdown-item" key={ this.props.name + '_item_' + index } onClick={ () => { this.handleItemClick(item) } } >{ item }</li>);
                  })
                }
              </ul>
            </div>
          </Toggleable>
        </div>
      </div>
    )
  }
}

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  itemClickHandler: PropTypes.func
};
