import React, { Component } from 'react';

import WishList from './wish_list';
import WishListsList from './wish_lists_list';
import { Switch, Route } from 'react-router-dom';

export default class WishListsController extends Component {
  render() {
    return (
      <div className='col-xs-12'>
        <Switch>
          <Route path='/profile/wish_lists/:id' component={ WishList } />
          <Route exact path='/profile/wish_lists' component={ WishListsList } />
        </Switch>
      </div>
    );
  }
}
