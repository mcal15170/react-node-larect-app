import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signOut, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  // console.log(history.location);
  if (history.location.pathname === path) return { color: "khaki" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/users")}
          to="/users"
        >
          Users
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          to={`/post/create`}
          style={isActive(history, `/post/create`)}
        >
          Create Post
        </Link>
      </li>

      {!isAuthenticated() && (
        <React.Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Sign In
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuthenticated() && (
        <React.Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/findPeople`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              Find People
            </Link>
          </li>{" "}
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/contact")}
              to="/contact"
            >
              Contact Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              {`${isAuthenticated().user.name.substring(0, 8)}'s profile`}
            </Link>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              style={
                (isActive(history, "/signin"),
                { cursor: "pointer", color: "#fff" })
              }
              onClick={() => signOut(() => history.push("/"))}
            >
              Sign Out
            </span>
          </li>
        </React.Fragment>
      )}
    </ul>
  </div>
);
export default withRouter(Menu);
