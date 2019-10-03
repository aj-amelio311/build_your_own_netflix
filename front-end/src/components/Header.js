import React, {Component} from "react";
import { withRouter } from 'react-router-dom';

class Header extends Component {
  render() {
    const currentRoute = this.props.history.location.pathname;
    let logo;
    if (currentRoute !== "/home") {
      logo = <img src="https://aj-website-file-storage.s3.us-east-2.amazonaws.com/other/home-logo.png" className="logo" />
    }
    return (
      <div>
        {logo}
      </div>
    )
  }
}


export default withRouter(Header);
