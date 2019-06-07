import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import { listByUser } from "../post/apiPost";
import DefaultProfile from "../images/avtar3.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTebs from "./ProfileTebs";
import $ from "jquery";
import "./Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { following: [], followers: [] },
      redirectTOSignIn: false,
      following: false,
      error: "",
      posts: []
    };
  }

  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids(followers)and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  // click follow button
  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectTOSignIn: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPost(data._id);
      }
    });
  };

  loadPost = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentWillMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  isCurrentUser(user) {
    if (isAuthenticated().user && isAuthenticated().user._id === user._id) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    $("#success-alert")
      .fadeTo(5000, 0.27)
      .slideUp(2000, function() {
        $("#success-alert").slideUp(500);
      });
  }

  render() {
    const { redirectTOSignIn, user, posts } = this.state;
    if (redirectTOSignIn) {
      return <Redirect to="/signin" />;
    }

    const photoURL = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : { DefaultProfile };
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="mt-5 mb-5">
              Profile&nbsp;&nbsp;
              <li
                className={
                  this.isCurrentUser(user)
                    ? "fas fa-user-clock"
                    : "fas fa-user-lock"
                }
                style={
                  this.isCurrentUser(user)
                    ? { color: "#009688", fontSize: "30px" }
                    : { color: "#f44336", fontSize: "30px" }
                }
              />
            </h2>
            {this.props.location.status && (
              <div
                className="alert alert-success col-md-12"
                id="success-alert"
                role="alert"
              >
                <div className="row">
                  <div className="col-md-10">
                    <i className="fas fa-user-check" />
                    &nbsp;Update User Profile Successfully
                  </div>
                  <div className="col-md-2">
                    <div className="bar">
                      <div className="in" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-4">
            <img
              src={photoURL}
              onError={i => {
                i.target.src = `${DefaultProfile}`;
              }}
              className="img-thumbnail"
              style={{ height: "300px", width: "300px" }}
              alt={user.name}
            />
          </div>
          <div className="col-md-8">
            <p>
              <i className="fa fa-id-card-o" />
              &nbsp;{user.name}
            </p>
            <p>
              <i className="fa fa-envelope-o" /> &nbsp;{user.email}
            </p>
            <p>
              <i className="fa fa-calendar" /> &nbsp;
              {`${new Date(user.created).toDateString()}`}
            </p>

            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block mt-5">
                <Link
                  className="btn btn-raised btn-info mr-5"
                  to={`/post/create`}
                >
                  Create Post
                </Link>
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                onButtonClick={this.clickFollowButton}
                following={this.state.following}
              />
            )}

            {!this.isCurrentUser(user) && (
              <div className="alert alert-warning " role="alert">
                <i className="fa fa-exclamation-triangle">&nbsp;</i>You Might
                Not Have Permission To Use This Account !
              </div>
            )}
          </div>
          <div className="col-md-12 mt-5">
            <hr />
            <p className="lead mb-0">
              <i className="fa fa-pencil" />
              &nbsp;
              {user.about
                ? user.about
                : "Information about user not avialable "}
            </p>
          </div>
          <hr />
          <div className="col-md-12  mb-5">
            <hr />
            <ProfileTebs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}
