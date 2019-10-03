import React, {Component} from "react";
import {Redirect} from "react-router-dom"

class Logout extends Component {

  componentDidMount() {
    sessionStorage.setItem("uid", "")
  }

  render() {
    return <Redirect to="/home" />
  }
}

export default Logout
