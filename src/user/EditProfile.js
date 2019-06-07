import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import loaderImg from "../images/loader.gif";
import DefaultProfile from "../images/avtar3.jpg";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      photo: "",
      name: "",
      email: "",
      about: "",
      password: "",
      redirectTOProfile: false,
      error: "",
      fileSize: 0,
      laoder: false,
      flagParam: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectTOProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  componentWillMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({ error: "error : File size should be less than 100kb !",
      laoder:false
     });

      return false;
    }

    if (name.length === 0) {
      this.setState({ error: "error : Name is required !" });
      return false;
    }

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      this.setState({ error: "error : A valid email is required !" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: "password must be at least 6 character long !" });
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
    this.userData.set([event.target.name], value);
    this.setState({ [event.target.name]: value, fileSize });
  };

  formSubmit = event => {
    event.preventDefault();
    this.setState({ laoder: true });
    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
          this.setState({ laoder: false });
        }
        // update local storage
        else {
          updateUser(data, () => {
            this.setState({
              redirectTOProfile: true,
              flagParam: true
            });
          });
        }
      });
    } else {
      this.setState({ laoder: false });
    }
  };

  signupForm = (name, email, password, about) => (
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
        <p className="text-muted">Name</p>
        <input
          type="text"
          onChange={this.handleChange}
          name="name"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <p className="text-muted">Email</p>
        <input
          type="text"
          onChange={this.handleChange}
          name="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <p className="text-muted">About</p>
        <textarea
          type="text"
          onChange={this.handleChange}
          name="about"
          className="form-control"
          value={about}
        />
      </div>
      <div className="form-group">
        <p className="text-muted">
          Password
          <span className="alert alert-info float-right" role="alert">
            <i className="fa fa-bell" />
            &nbsp;Note : You can go with old Password then ignore password field
          </span>
        </p>
        <input
          type="Password"
          onChange={this.handleChange}
          name="password"
          className="form-control"
          value={password}
        />
      </div>

      <button onClick={this.formSubmit} className="btn btn-raised btn-primary">
        Update Profile
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectTOProfile,
      error,
      laoder,
      flagParam,
      about
    } = this.state;

    if (redirectTOProfile && flagParam) {
      return (
        <Redirect
          to={{
            pathname: `/user/${id}`,
            status: { flag: flagParam }
          }}
        />
      );
    }

    const photoURL = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : { DefaultProfile };

    return (
      <div className="container">
        <div className="col-md-12">
          <h2 className="mt-5 mb-5">Edit Profile</h2>
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

          <img
            src={photoURL}
            onError={i => {
              i.target.src = `${DefaultProfile}`;
            }}
            className="img-thumbnail"
            style={{ height: "200px", width: "auto" }}
            alt={name}
          />
          {this.signupForm(name, email, password, about)}
        </div>
      </div>
    );
  }
}
