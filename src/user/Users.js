import React, { Component } from "react";
import { Link } from "react-router-dom";
import { list } from "./apiUser";
import DefaultProfile from "../images/avtar3.jpg";

export default class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = users => (
    <div className="row">
      {users.map((user, i) => (
        <div className="col-md-4" key={i}>
          <div className="card" style={{ marginBottom: "30px" }}>
            <img
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
              onError={i=>{i.target.src=`${DefaultProfile}`}}
              className="img-thumbnail"
              style={{ width: "100%", height: "15vw", objectFit: "cover" }}
              alt={user.name}
            />
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">{user.email}</p>
              <Link
                to={`/user/${user._id}`}
                className="btn btn-raised btn-primary btn-sm"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  render() {
    const { users } = this.state;
    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">Users</h2>
          {this.renderUsers(users)}
        </div>
      </div>
    );
  }
}
