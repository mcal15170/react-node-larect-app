import React, { Component } from "react";
import axios from "axios";
import { Loader, Loading } from "../Loading";

export default class AxiosDemo extends Component {
  constructor(props) {
    super(props);
    // state
    this.state = {
      users: [],
      loading: false,
      loaderMsg: "Hi User , Wait Untill Data Not Load ..."
    };
  }

  getUsers() {
    this.setState({ loading: true });
    axios("https://api.randomuser.me/?nat=US&results=5").then(response => {
      this.setState({ users: [...this.state.users, ...response.data.results] });
      this.setState({ loading: false });
    });
  }

  componentWillMount() {
    this.getUsers();
  }

  // get more user handler
  getMoreUsers = () => {
    this.getUsers();
  };

  render() {
    // destructor code
    const { users, loading, loaderMsg } = this.state;

    return (
      <React.Fragment>
        {!loading ? (
          <button onClick={this.getMoreUsers}>More Users</button>
        ) : (
          ""
        )}
        {loading ? (
          <Loader message={loaderMsg} minute={15} />
        ) : (
          users.map((user, index) => (
            <div key={user.id.value}>
              <h4>{index + 1}</h4>
              <h5 style={{ color: "red" }}>{user.name.first}</h5>
              <p>{user.email}</p>
              <hr />
            </div>
          ))
        )}
      </React.Fragment>
    );
  }
}
