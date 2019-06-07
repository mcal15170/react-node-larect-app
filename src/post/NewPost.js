import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import loaderImg from "../images/loader.gif";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      fileSize: 0,
      user: {},
      isredirectToProfile: false
    };
  }

  componentWillMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
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
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      create(userId, token, this.postData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
          this.setState({ laoder: false });
        }
        // create post success
        else {
          this.setState({
            title: "",
            body: "",
            photo: "",
            laoder: false,
            isredirectToProfile: true
          });
        }
      });
    } else {
      this.setState({ laoder: false });
    }
  };

  newPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <p className="text-muted">Upload Photo</p>
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
        Create Post
      </button>
    </form>
  );

  render() {
    const {
      title,
      body,
      photo,
      error,
      laoder,
      user,
      isredirectToProfile
    } = this.state;

    if (isredirectToProfile) {
      return (
        <Redirect
          to={{
            pathname: `/user/${user._id}`
          }}
        />
      );
    }

    return (
      <div className="container">
        <div className="col-md-12">
          <h2 className="mt-5 mb-5">Create New Post </h2>
          {/* error */}
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            <i className="fa fa-exclamation-triangle float-right" />
            {error}
          </div>
          {/* laoder */}
          {laoder && (
            <div className="text-center">
              <img src={loaderImg} alt="loading img" />
            </div>
          )}

          {this.newPostForm(title, body)}
        </div>
      </div>
    );
  }
}
export default NewPost;
