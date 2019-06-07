import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import loaderImg from "../images/loader.gif";
import DefaultPost from "../images/defaultPost.png";

export default class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      error: "",
      redirectTOProfile: false,
      fileSize: 0,
      laoder: false
    };
  }

  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectTOProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: ""
        });
      }
    });
  };

  componentWillMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { fileSize, title, body } = this.state;
    if (fileSize > 100000) {
      this.setState({ error: "error : File size should be less than 100kb !" });
      return false;
    }

    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "error : All Fields is required !" });
      return false;
    }

    return true;
  };

  handleChange = event => {
    this.setState({ error: "" });
    const value =
      event.target.name === "photo"
        ? event.target.files[0]
        : event.target.value;
    const fileSize =
      event.target.name === "photo" ? event.target.files[0].size : 0;
    this.postData.set([event.target.name], value);
    this.setState({ [event.target.name]: value, fileSize });
  };

  formSubmit = event => {
    event.preventDefault();
    this.setState({ laoder: true });
    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      update(postId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        }
        // create post success
        else {
          this.setState({
            title: "",
            body: "",
            laoder: false,
            redirectTOProfile: true
          });
        }
      });
    } else {
      this.setState({ laoder: false });
    }
  };

  editFormPost = (title, body) => (
    <form>
      <div className="form-group">
        <p className="text-muted">Post Photo</p>
        <input
          type="file"
          accept="image/*"
          onChange={this.handleChange}
          name="photo"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <p className="text-muted">Title</p>
        <input
          type="text"
          onChange={this.handleChange}
          name="title"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <p className="text-muted">Body</p>
        <textarea
          type="text"
          onChange={this.handleChange}
          name="body"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.formSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  

  render() {
    const { id, title, body, redirectTOProfile, error, laoder } = this.state;

    if (redirectTOProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    const photoURL = id
      ? `${
          process.env.REACT_APP_API_URL
        }/post/photo/${id}?${new Date().getTime()}`
      : { DefaultPost };

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          <i className="fa fa-exclamation-triangle float-right" />
          {error}
        </div>

        {laoder && (
          <div className="text-center">
            <img src={loaderImg} alt="loading img" />
          </div>
        )}

        <img
          src={photoURL}
          onError={i => {
            i.target.src = `${DefaultPost}`;
          }}
          className="img-thumbnail"
          style={{ height: "200px", width: "auto" }}
          alt={title}
        />

        {this.editFormPost(title, body)}
      </div>
    );
  }
}
