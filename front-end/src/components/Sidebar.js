import React, {Component} from "react";
import "../sidebar.css";
import {Link} from "react-router-dom";

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.search = this.search.bind(this);
  }

  search() {
    this.props.passRefUpward(this.refs);
  }

  render() {
    return (
      <div className="col-md-4" >
        <div className="sidebar">
          <div className="listItemB">
              <input type="text" onChange={this.search} ref="searchbar" className="filterSearch" placeholder="Search for a Movie:"/>
          </div>
          <ul>
            <Link to="/dashboard"><li className="listItemA">Dashboard</li></Link>
            <Link to="/queue"><li className="listItemA">Queue</li></Link>
            <Link to="/profile"><li className="listItemA">Profile</li></Link>
            <Link to="/logout"><li className="listItemA">Sign Out</li></Link>
          </ul>
        </div>

      </div>
    )
  }
}

export default Sidebar;
