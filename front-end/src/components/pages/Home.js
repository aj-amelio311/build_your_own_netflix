import React, {Component} from "react";
import Login from "../Login";
import Create from "../Create";
import {Link} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="home-logo">
          <img src="https://aj-website-file-storage.s3.us-east-2.amazonaws.com/other/home-logo.png" className="home-logo-img" />
        </div>
        <Link to="/login" className="btn home-button">Sign In</Link>
        <Link to="/create" className="btn home-button">Create Account</Link>
      </div>
    )
  }
}


export default Home;
