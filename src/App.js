import React, { Component } from 'react';
import './App.css';
import Header from './layout/header'
import PostsHandler from './api_handlers/posts_handler'

const apiHost = process.env.REACT_APP_API_HOST;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postsHandler: <PostsHandler apiHost={apiHost} />
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        { this.state.postsHandler }
      </div>
    );
  }
}

export default App;
