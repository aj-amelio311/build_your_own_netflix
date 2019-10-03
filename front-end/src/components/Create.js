import React, {Component} from "react";
import axios from "axios";
import {Redirect, Link} from "react-router-dom";
import {config} from "../../appconfig.js";
import {cleanMovie} from "../Util.js";
import {v4 as uuid} from "uuid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userId: "",
      filepath: "",
      loginSuccess: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

  }

    handleSubmit(event) {
      event.preventDefault();
      const body = {
        username: this.state.username,
        password: this.state.password,
        user_id: this.state.userId,
        file_path: this.state.filepath
      }
      sessionStorage.setItem("uid", this.state.userId);
      sessionStorage.setItem("filepath", this.state.filepath);
      axios.post(`${config.api}/create_account`, body).then((resp) => {
          if (resp.data.status === 200) {
            this.setState({loginSuccess: true})
          }
      })
    }

    handleChange(event) {
      this.setState({[event.target.name]: event.target.value})
      let user_id = uuid();
      this.setState({userId: user_id});
    }

    render() {
      const redirectToReferrer = this.state.loginSuccess;
      if (redirectToReferrer === true) {
          return <Redirect to="/build_library" />
      }
      return (
        <div>
          <div className="col-md-6 center-column">
            <div className="back-button">
              <Link to="/home"><span><FontAwesomeIcon className="fa-icon" icon={faArrowLeft}  size="3x" /></span></Link>
            </div>
            <h4 className="center-text">Create Account</h4>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Username</label>
                <input type="text" className="form-control" name="username" onChange={this.handleChange} placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Password</label>
                <input type="password" className="form-control" name="password" onChange={this.handleChange} placeholder="Enter password" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">File Path</label>
                <input type="text" className="form-control" name="filepath" onChange={this.handleChange} placeholder="Enter file path to movies" />
              </div>
              <button type="submit" className="btn btn-secondary home-button">Submit</button>
            </form>
          </div>
        </div>
      )
    }
}

export default Create;
