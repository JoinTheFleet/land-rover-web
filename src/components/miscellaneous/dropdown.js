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
      currentSelectedValue: null,
      currentSelectedText: null,
      open: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState((prevState) => ( { open: !prevState.open } ));
  }

  handleItemClick(value, text) {
    let name = this.props.name;

    this.setState({
      open: 'false' // TODO: check what's wrong with this (doesn't work with boolean false value)
    }, () => {

      if(this.props.itemClickHandler) {
        if (name) {
          this.props.itemClickHandler(name, value);
        }
        else {
          this.props.itemClickHandler(value);
        }
      }
    });
  }

  render() {
    let currentItemText = this.props.placeholder;
    let displayProperty = this.props.displayProperty;

    let items =
      this.props.items.map((item, index) => {

        let valueText = this.props.valueProperty ? item[this.props.valueProperty] : item;
        let displayText = valueText;

        if (displayProperty) {
          if (displayProperty.constructor === Array) {
            for(let i = 0; i < displayProperty.length; i++) {
              if (item[displayProperty[i]] && item[displayProperty[i]] !== '') {
                displayText = item[displayProperty[i]];
                break;
              }
            }
          }
          else {
            displayText = item[displayProperty];
          }
        }

        if (item[this.props.valueProperty] === this.props.selectedValue) {
          currentItemText = `${this.props.placeholder}: ${displayText}`;
        }

        return (<li className="dropdown-item" key={ this.props.name + '_item_' + index } onClick={ () => { this.handleItemClick(valueText, displayText) } } >{ displayText }</li>);
      });

    return (
      <div className="fleet-dropdown">
        <div className="currentSelectedItem" onClick={ () => { this.toggleDropdown() } }>
          <span className={ currentItemText !== this.props.placeholder ? 'subtitle-font-weight' : '' } >{ currentItemText }</span>
          <img src={ this.state.open ? dropdownOpenIcon : dropdownIcon } alt="dropdown_icon" />
          <input type="hidden" id={ this.props.name } name={ this.props.name } value={ this.state.currentSelectedValue || '' } />

          <Toggleable open={ this.state.open } duration={ 250 } >
            <div className="dropdown-items">
              <ul>
                { items }
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
  valueProperty: PropTypes.string,
  displayProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  prefixPlaceholder: PropTypes.bool,
  noPaddingOnList: PropTypes.bool,
  itemClickHandler: PropTypes.func
};
