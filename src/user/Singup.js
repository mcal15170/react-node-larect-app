import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import { validateEmail } from "../user/apiUser";
import { validatePass } from "../user/apiUser";
import { validateName } from "../user/apiUser";

export default class Singup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      nameError: "",
      email: "",
      emailError: "",
      password: "",
      passError: "",
      error: "",
      open: false
    };
  }
  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };

  validate = () => {
    const { name, email, password } = this.state;
    let emailError = "";
    let passError = "";
    let nameError = "";

    if (!validateName(name)) {
      nameError = "* Name is invalid ,It Contain Only Character!";
    }

    if (!name) {
      nameError = "* Name is Required ,Please Correct It!";
    }

    if (!validateEmail(email)) {
      emailError = "* Email is invalid ,Please Correct It!";
    }
    if (!email) {
      emailError = "* Email is Required ,Please Correct It!";
    }

    if (!validatePass(password)) {
      passError =
        "* Password is invalid,It must contain number and minimum length is 6 !";
    }

    if (!password) {
      passError = "* Password is Required ,Please Correct It!";
    }

    if (emailError || passError || nameError) {
      this.setState({
        nameError: nameError,
        emailError: emailError,
        passError: passError
      });
      return false;
    }

    return true;
  };

  formSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const isValid = this.validate();
    if (isValid) {
      const user = {
        name,
        email,
        password
      };
      signup(user).then(data => {
        this.setState({ nameError: "", emailError: "", passError: "" });
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            error: "",
            name: "",
            email: "",
            password: "",
            open: true
          });
      });
    }
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <p className="text-muted">
          Name
          {this.state.nameError && (
            <span className="alert alert-danger float-right" role="alert">
              {this.state.nameError}
            </span>
          )}
        </p>
        <input
          type="text"
          onChange={this.handleChange}
          name="name"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <p className="text-muted">
          Email
          {this.state.emailError && (
            <span className="alert alert-danger float-right" role="alert">
              {this.state.emailError}
            </span>
          )}
        </p>
        <input
          type="text"
          onChange={this.handleChange}
          name="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <p className="text-muted">
          Password
          {this.state.passError && (
            <span className="alert alert-danger float-right" role="alert">
              {this.state.passError}
            </span>
          )}
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
        Submit
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">SignUP</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          New Account SuccessFully Created , PLease&nbsp;
          <Link className="alert-link" to="/signin">Sign In</Link>
        </div>

        {/* <form> */}
        {this.signupForm(name, email, password)}
        {/* </form> */}
      </div>
    );
  }
}
