import { Component } from "react";
import { signUp } from "../utilities/users-service";

export default class SignUpForm extends Component {
  state = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirm: "",
    error: "",
    success: "",
  };

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value, error: "" });
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { lastName, firstName, email, password } = this.state;
      const formData = { lastname: lastName, firstname: firstName, email, password };
      const res = await signUp(formData);
      this.setState({ success: res.message, lastName: "", firstName: "", email: "", password: "", confirm: "" });
    } catch (error) {
      const msg =
        error.message === "Email already exists"
          ? "Sign Up Failed - email already used!"
          : "Sign Up Failed - Try Again";
      this.setState({ error: msg });
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;

    if (this.state.success) {
      return (
        <div className="auth-card">
          <h2 className="auth-title">Check Your Email</h2>
          <p style={{ textAlign: "center", color: "#555" }}>{this.state.success}</p>
        </div>
      );
    }

    return (
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="auth-field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={this.state.confirm}
              onChange={this.handleChange}
              required
            />
          </div>
          {this.state.error && <p className="auth-error">{this.state.error}</p>}
          <button className="auth-btn" type="submit" disabled={disable}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}
