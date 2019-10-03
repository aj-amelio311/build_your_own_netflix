import React, {Component} from "react";

class Movie extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let title = this.props.item.title
    let imgPath = `http://image.tmdb.org/t/p/w185/${this.props.item.poster_path}`;
    return (
      <div className="tile" moviedata={title}>
        <img src={imgPath} />
      </div>
    )
  }
}

export default Movie;
