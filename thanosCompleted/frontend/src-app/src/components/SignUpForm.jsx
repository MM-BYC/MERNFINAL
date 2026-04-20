import { Component } from "react";
import { signUp } from "../utilities/users-service";

export default class SignUpForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    error: "",
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: "",
    });
  };
  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const formData = { ...this.state };
      delete formData.error;
      delete formData.confirm;
      const user = await signUp(formData);
      console.log(user);
      this.props.setUser(user);
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

    return (
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
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
          {this.state.error && (
            <p className="auth-error">{this.state.error}</p>
          )}
          <button className="auth-btn" type="submit" disabled={disable}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}
