import React, { Component } from 'react';
import ajax from 'superagent';

class PostsHandler extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      selectedPost: null
    }

    this.selectPost = this.selectPost.bind(this);
    this.retrievePosts = this.retrievePosts.bind(this);
    this.renderPostsList = this.renderPostsList.bind(this);
    this.renderSelectedPost = this.renderSelectedPost.bind(this);
  }

  componentWillMount(){
    this.retrievePosts();
  }

  retrievePosts(successCallback, errorCallback) {
    ajax
      .get(this.props.apiHost + '/posts')
      .end((err, res) => {
        if(!err && res) {
          this.setState({ posts: res.body });
        }
        else {
          console.log(err);
        }
      });
  }

  selectPost(post) {
    let postToSelect = null;

    if(post != this.state.selectedPost) {
      postToSelect = post;
    }

    this.setState({selectedPost: postToSelect});
  }

  renderPostsList() {
    return this.state.posts.map((post, index) => <div key={'post' + index} onClick={() => { this.selectPost(post) } }>{post.title}</div>);
  }

  renderSelectedPost(){
    return (<div onClick={() => { this.selectPost(this.state.selectedPost) } }>{this.state.selectedPost.title}</div>);
  }

  render() {
    let elementsToRender = null;

    if(this.state.selectedPost) {
      elementsToRender = this.renderSelectedPost();
    }
    else {
      elementsToRender =  this.renderPostsList();
    }

    return (
      <div>
        { elementsToRender }
      </div>
    )
  }
}

export default PostsHandler;
