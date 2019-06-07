import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };

  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };
  render() {
    return (
      <div className="d-inline-block mb-5">
        {!this.props.following ? (
          <button
            className="btn btn-success btn-raised mr-5"
            onClick={this.followClick}
          >
            Follow&nbsp;
            <i className="fas fa-user-plus" />
          </button>
        ) : (
          <button
            className="btn btn-warning btn-raised"
            onClick={this.unfollowClick}
          >
            UnFollow&nbsp;
            <i className="fas fa-user-minus" />
          </button>
        )}
      </div>
    );
  }
}

export default FollowProfileButton;
