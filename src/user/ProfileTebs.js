import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avtar3.jpg";
import { userInfo } from "os";

class ProfileTebs extends Component {
  render() {
    const { followers, following, posts } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-4">
            <h4 className="text-primary">
              Followers{" "}
              <i className="fa fa-heart"> {Object.keys(followers).length}</i>
            </h4>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
                <div className="row">
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <div className="row">
                        <div className="col-md-4">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${
                              person._id
                            }`}
                            alt={person.name}
                            onError={i => {
                              i.target.src = `${DefaultProfile}`;
                            }}
                            style={{
                              borderRadius: "50%",
                              border: "1.5px solid black"
                            }}
                            className="mr-2"
                            height="35px"
                            width="35px"
                          />
                        </div>
                        <div className="col-md-8">
                          <h5>{person.name}</h5>
                        </div>
                      </div>
                    </Link>
                    <p style={{ clear: "both" }}>{person.about}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h4 className="text-primary">
              Following{" "}
              <i className="fa fa-heart"> {Object.keys(following).length}</i>
            </h4>
            <hr />
            {following.map((person, i) => (
              <div key={i}>
                <div className="row">
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <div className="row">
                        <div className="col-md-4">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${
                              person._id
                            }`}
                            alt={person.name}
                            onError={i => {
                              i.target.src = `${DefaultProfile}`;
                            }}
                            style={{
                              borderRadius: "50%",
                              border: "1.5px solid black"
                            }}
                            className="mr-2"
                            height="35px"
                            width="35px"
                          />
                        </div>
                        <div className="col-md-8">
                          <h5>{person.name}</h5>
                        </div>
                      </div>
                    </Link>
                    <p style={{ clear: "both" }}>{person.about}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Post</h3>
            <hr />
            <div className="row">
              {posts.map((post, i) => (
                <div className="col-md-12" key={i}>
                  <Link to={`/post/${post._id}`}>
                    <h5>{post.title}</h5>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileTebs;
