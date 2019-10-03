import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Link, withRouter} from "react-router-dom";
import {Redirect} from "react-router-dom"
import Logo from "../assets/logo.png";

import '../bootstrap.min.css';
import "../style.css";

import '../bootstrap.min.js';

import Dashboard from "./pages/Dashboard";
import Queue from "./pages/Queue";
import Profile from "./pages/Profile";
import Header from "./Header";
import Login from "./Login";
import Logout from "./Logout";
import Create from "./Create";
import Home from "./pages/Home";
import BuildLibrary from "./BuildLibrary";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Header/>
        <Redirect from="/" to="/home" />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/create" component={Create} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/queue" component={Queue} />
        <Route path="/profile" component={Profile} />
        <Route path="/build_library" component={BuildLibrary} />
      </Router>
    )
  }
}

export default App
