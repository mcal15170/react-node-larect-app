import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/defaultPost.png";
import LoaderImg from "../images/loader.gif";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Comment from "./Comments";

class SinglePost extends Component {
  state = {
    post: "",
    redirectTOHome: false,
    like: false,
    likes: 0,
    rediredtToSignIn: false,
    comments: []
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments:data.comments
        });
      }
    });
  }

  updateComments = comments => {
    this.setState({ comments: comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ rediredtToSignIn: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectTOHome: true });
      }
    });
  };

  deleteConfiremd = () => {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this Post?",
      buttons: [
        {
          label: "Yes , Delete it !",
          onClick: () => this.deletePost()
        },
        {
          label: "No",
          onClick: () => console.log("delete cancle")
        }
      ]
    });
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unkown";
    const { like, likes } = this.state;
    return (
      <React.Fragment>
        <div className="jumbotron text-center">
          <h4 className="card-title h4 pb-2">
            <strong style={{ textTransform: "capitalize" }}>
              {post.title}
            </strong>
          </h4>

          <div className="view overlay my-4">
            <img
              src={
                post._id
                  ? `${process.env.REACT_APP_API_URL}/post/photo/${
                      post._id
                    }?${new Date().getTime()}`
                  : { DefaultPost }
              }
              onError={i => {
                i.target.src = `${DefaultPost}`;
              }}
              className="img-fluid"
              style={{ width: "100%", height: "15vw", objectFit: "cover" }}
              alt={post.title}
            />
          </div>

          {like ? (
            <h3 onClick={this.likeToggle}>
              <i
                className="fa fa-thumbs-up text-success bg-dark mr-2"
                style={{ padding: "10px", borderRadius: "50%" }}
              />
              {likes} Like
            </h3>
          ) : (
            <h3 onClick={this.likeToggle}>
              <i
                className="fa fa-thumbs-up text-danger bg-dark mr-2"
                style={{ padding: "10px", borderRadius: "50%" }}
              />
              {likes} Like
            </h3>
          )}

          <p className="card-text">{post.body}</p>

          <p className="font-weight-normal">
            by{" "}
            <a style={{ color: "#343a40" }} href={`${posterId}`}>
              <strong>{posterName}</strong>
            </a>
            , {new Date(post.created).toDateString()}
          </p>

          <a className="fa-lg p-2 m-2 li-ic">
            <i className="fab fa-linkedin-in grey-text" />
          </a>

          <a className="fa-lg p-2 m-2 tw-ic">
            <i className="fab fa-twitter grey-text" />
          </a>

          <a className="fa-lg p-2 m-2 fb-ic">
            <i className="fab fa-facebook-f grey-text" />
          </a>
          <br />
          <div className="d-inline-block mt-3">
            <Link to={"/"} className="btn btn-raised btn-info btn-sm  mr-5">
              Back to Posts &nbsp;
              <i className="fa fa-share-square-o fa-lg" />
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <React.Fragment>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-primary btn-sm  mr-5"
                  >
                    Edit Post
                  </Link>
                  <button
                    className="btn btn-raised btn-warning btn-sm"
                    onClick={this.deleteConfiremd}
                  >
                    Delete Post
                  </button>
                </React.Fragment>
              )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { post, redirectTOHome, rediredtToSignIn, comments } = this.state;

    if (redirectTOHome) {
      return <Redirect to={`/`} />;
    } else if (rediredtToSignIn) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="mt-5 mb-5" style={{ textTransform: "capitalize" }}>
              {post.title}
            </h2>

            {!post ? (
              <div className="text-center">
                <img src={LoaderImg} />
              </div>
            ) : (
              this.renderPost(post)
            )}

            <div className="jumbotron text-center">
              <Comment
                postId={post._id}
                comments={comments.reverse()}
                updateComments={this.updateComments}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SinglePost;
