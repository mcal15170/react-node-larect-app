import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth";
import { validateEmail } from "../user/apiUser";
import { validatePass } from "../user/apiUser";

export default class Singin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      emailError: "",
      password: "",
      passError: "",
      error: "",
      redirecTOReferer: false
    };
  }

  handleChange = event => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };

  validate = () => {
    const { email, password } = this.state;
    let emailError = "";
    let passError = "";
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

    if (emailError || passError) {
      this.setState({ emailError: emailError, passError: passError });
      return false;
    }

    return true;
  };

  formSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const isValid = this.validate();
    if (isValid) {
      const user = {
        email,
        password
      };
      signin(user).then(data => {
        this.setState({ passError: "", emailError: "" });
        if (data.error) this.setState({ error: data.error });
        // user authentication
        else
          authenticate(data, () => {
            this.setState({ redirecTOReferer: true });
          });
        // redirection
      });
    }
  };

  signinForm = (email, password) => (
    <form>
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
    const { email, password, error, redirecTOReferer } = this.state;

    if (redirecTOReferer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">SignIn</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {/* <form> */}
        {this.signinForm(email, password)}
        {/* </form> */}
      </div>
    );
  }
}
