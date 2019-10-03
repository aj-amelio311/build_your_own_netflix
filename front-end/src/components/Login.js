import React, {Component} from "react";
import axios from "axios";
import {Redirect, Link} from "react-router-dom";
import {config} from "../../appconfig.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginSuccess: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

    handleSubmit(event) {
      event.preventDefault();
      if (this.state.username !== "" && this.state.password !== "") {
        let body = {
          username: this.state.username,
          password: this.state.password
        }
        axios.post(`${config.api}/login`, body).then((resp) => {
          if (resp.data.status === 200) {
              sessionStorage.setItem("uid", resp.data.user_id);
              sessionStorage.setItem("filepath", resp.data.file_path);
              this.setState({loginSuccess: true})
          } else {
            alert("Invalid Login")
          }
        })
      }
    }

    handleChange(event) {
      this.setState({[event.target.name]: event.target.value})
    }

    render() {
      const redirectToReferrer = this.state.loginSuccess;
      if (redirectToReferrer === true) {
          return <Redirect to="/dashboard" />
      }
      return (
        <div className="col-md-6 center-column">
          <div className="back-button">
            <Link to="/home"><span><FontAwesomeIcon className="fa-icon" icon={faArrowLeft}  size="3x" /></span></Link>
          </div>
          <h4 className="center-text">Sign In</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Username</label>
              <input type="text" className="form-control" name="username" onChange={this.handleChange} placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Password</label>
              <input type="password" className="form-control" name="password" onChange={this.handleChange} placeholder="Enter password" />
            </div>
            <button type="submit" className="btn btn-secondary home-button">Submit</button>
          </form>
        </div>
      )
    }
}

export default Login;
