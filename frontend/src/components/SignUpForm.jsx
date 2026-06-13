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
    showPassword: false,
    showConfirm: false,
    isDark: false,
  };

  componentDidMount() {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      this.setState({ isDark: theme === "dark" });
    };

    updateTheme();
    this.observer = new MutationObserver(updateTheme);
    this.observer.observe(document.documentElement, { attributes: true });
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value, error: "" });
  };

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  toggleConfirmVisibility = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { lastName, firstName, email, password } = this.state;
      const formData = {
        lastname: lastName,
        firstname: firstName,
        email,
        password,
      };
      const res = await signUp(formData);
      this.setState({
        success: res.message,
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        confirm: "",
      });
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
          <p className="auth-info-message">
            {this.state.success}
          </p>
        </div>
      );
    }

    return (
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
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
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={this.state.showPassword ? "text" : "password"}
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
                style={{ paddingRight: "40px", width: "100%" }}
              />
              <button
                type="button"
                onClick={this.togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={
                  this.state.showPassword ? "Hide password" : "Show password"
                }
              >
                {this.state.showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={this.state.isDark ? "white" : "black"}
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={this.state.isDark ? "white" : "black"}
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type={this.state.showConfirm ? "text" : "password"}
                name="confirm"
                value={this.state.confirm}
                onChange={this.handleChange}
                required
                style={{ paddingRight: "40px", width: "100%" }}
              />
              <button
                type="button"
                onClick={this.toggleConfirmVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={
                  this.state.showConfirm ? "Hide password" : "Show password"
                }
              >
                {this.state.showConfirm ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={this.state.isDark ? "white" : "black"}
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={this.state.isDark ? "white" : "black"}
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
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
